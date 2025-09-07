import cv2
import joblib
import numpy as np
import os
import csv
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, render_template, Response, request, redirect, url_for, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import traceback
import threading
import time
from queue import Queue

# --- Configuration ---
DATABASE_PATH = "face_database_multiple.joblib"
ATTENDANCE_FOLDER = "./"
THRESHOLD = 0.75
KNN_NEIGHBORS = 5
BOX_DISPLAY_TIME = 2  # seconds
CAPTURE_COUNT = 150
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
FRAME_RESIZE_WIDTH = 640  # Resize frames to this width for faster processing

# --- Global State ---
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://localhost:5175"]}})

# Lazy-loaded models
embedder = None
detector = None

# Database state
database = {}
marked = set()
display_timers = {}

# Control flags
camera_active = False
attendance_active = False

# Frame processing queue and worker thread
frame_queue = Queue(maxsize=2)
recognition_results = Queue(maxsize=2)
processing_thread = None

# --- Model Loading ---
def get_embedder():
    global embedder
    if embedder is None:
        from keras_facenet import FaceNet
        embedder = FaceNet()
    return embedder

def get_detector():
    global detector
    if detector is None:
        from mtcnn import MTCNN
        detector = MTCNN()
    return detector

# --- Database Loading ---
def load_database_in_background():
    global database
    if os.path.exists(DATABASE_PATH):
        try:
            database = joblib.load(DATABASE_PATH)
            print(f"Loaded database with {len(database)} people")
        except Exception:
            database = {}
    else:
        database = {}

# Start loading the database in a background thread
db_thread = threading.Thread(target=load_database_in_background)
db_thread.daemon = True
db_thread.start()

# --- Attendance CSV ---
def get_attendance_filename():
    date_str = datetime.now().strftime("%Y-%m-%d")
    return os.path.join(ATTENDANCE_FOLDER, f"attendance_{date_str}.csv")

def initialize_attendance_file():
    filename = get_attendance_filename()
    if not os.path.exists(filename):
        with open(filename, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Name", "Time"])

initialize_attendance_file()

# --- Helper Functions ---

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_uploaded_image(image_file):
    """Process uploaded image and extract face embedding"""
    try:
        # Save the uploaded file temporarily
        filename = secure_filename(image_file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(filepath)
        
        # Read and process the image
        img = cv2.imread(filepath)
        if img is None:
            os.remove(filepath)  # Clean up
            return None, "Could not read the uploaded image"
            
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        faces = get_detector().detect_faces(rgb)
        
        if not faces:
            os.remove(filepath)  # Clean up
            return None, "No face detected in the uploaded image"
            
        # Get the first detected face
        face = faces[0]
        confidence = face.get('confidence', 0)
        
        if confidence < 0.9:
            os.remove(filepath)  # Clean up
            return None, f"Face detection confidence too low: {confidence:.2f}"
            
        x, y, w, h = face.get('box', (0, 0, 0, 0))
        x, y = max(0, x), max(0, y)
        w, h = max(1, w), max(1, h)
        roi = rgb[y:y+h, x:x+w]
        
        if roi.size == 0:
            os.remove(filepath)  # Clean up
            return None, "Invalid face region detected"
            
        # Generate face embedding
        face_resized = cv2.resize(roi, (160, 160))
        embedding = get_embedder().embeddings([face_resized])[0]
        
        # Clean up temporary file
        os.remove(filepath)
        
        return embedding, None
        
    except Exception as e:
        # Clean up temporary file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return None, f"Error processing image: {str(e)}"

# --- Face Recognition Worker ---
def recognition_worker():
    while True:
        frame, rgb_frame = frame_queue.get()
        if frame is None:  # Sentinel value to stop the thread
            break

        try:
            faces = get_detector().detect_faces(rgb_frame)
            recognized_faces = []

            for face in faces:
                confidence = face.get('confidence', 0)
                if confidence < 0.9:
                    continue

                x, y, w, h = face.get('box', (0,0,0,0))
                x, y = max(0, x), max(0, y)
                roi = rgb_frame[y:y+h, x:x+w]

                if roi.size > 0:
                    try:
                        face_resized = cv2.resize(roi, (160, 160))
                        emb = get_embedder().embeddings([face_resized])[0]
                        name = recognize_face(emb, database)
                        recognized_faces.append((name, (x, y, w, h), confidence))
                    except Exception:
                        # Could not process face, but we can still draw a box
                        recognized_faces.append(("Unknown", (x, y, w, h), confidence))
                        pass  # Skip bad frames
            
            if not recognition_results.full():
                recognition_results.put(recognized_faces)

        except Exception as e:
            # If detection fails, put an empty list to keep the stream going
            if not recognition_results.full():
                recognition_results.put([])
            print(f"Error in recognition_worker: {e}")

# --- Main Application Logic ---
def recognize_face(face_embedding, db, threshold=THRESHOLD, k_neighbors=KNN_NEIGHBORS):
    best_score, best_person = -1, "Unknown"
    for person, embeddings_list in db.items():
        if not embeddings_list:
            continue
        k = min(k_neighbors, len(embeddings_list))
        try:
            sims = cosine_similarity([face_embedding], embeddings_list)
            top_k_sim = np.sort(sims[0])[-k:]
            max_sim = np.mean(top_k_sim)
        except Exception:
            continue
        if max_sim > best_score:
            best_score, best_person = max_sim, person
    return best_person if best_score >= threshold else "Unknown"

def mark_attendance(name):
    if attendance_active and name not in marked and name != "Unknown":
        now = datetime.now().strftime("%H:%M:%S")
        with open(get_attendance_filename(), "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([name, now])
        marked.add(name)
        print(f"{name} marked at {now}")

# --- Video Streaming ---
def generate_frames():
    global camera_active
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        camera_active = False
        return

    try:
        while camera_active:
            success, frame = cap.read()
            if not success or frame is None:
                break

            # Resize frame for faster processing
            h, w, _ = frame.shape
            if w > FRAME_RESIZE_WIDTH:
                aspect_ratio = h / w
                new_w = FRAME_RESIZE_WIDTH
                new_h = int(new_w * aspect_ratio)
                frame = cv2.resize(frame, (new_w, new_h))

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            if not frame_queue.full():
                frame_queue.put((frame.copy(), rgb))

            # Get results from the recognition worker
            if not recognition_results.empty():
                recognized_faces = recognition_results.get()
                current_time = datetime.now()
                
                for name, (x, y, w, h), confidence in recognized_faces:
                    color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                    
                    # Mark attendance for known faces
                    if name != "Unknown" and attendance_active:
                        mark_attendance(name)
                        display_timers[name] = current_time + timedelta(seconds=BOX_DISPLAY_TIME)

                    # Draw bounding box for all confident detections
                    cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                    
                    # Prepare text label
                    label = f"{name} ({confidence:.2f})"
                    
                    # Add a background to the text for better readability
                    (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                    cv2.rectangle(frame, (x, y - text_h - 10), (x + text_w, y), color, -1)
                    cv2.putText(frame, label, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

            # Encode and yield the frame
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    finally:
        cap.release()

# --- Flask Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/start', methods=['POST'])
def api_start():
    global camera_active, attendance_active, processing_thread
    if not camera_active:
        camera_active = True
        attendance_active = True
        processing_thread = threading.Thread(target=recognition_worker)
        processing_thread.daemon = True
        processing_thread.start()
    return jsonify({"status": "Camera started, attendance active"})

@app.route('/api/stop', methods=['POST'])
def api_stop():
    global camera_active, attendance_active, processing_thread
    if camera_active:
        camera_active = False
        attendance_active = False
        if processing_thread:
            frame_queue.put((None, None))  # Signal worker to exit
            processing_thread.join()
            processing_thread = None
    return jsonify({"status": "Camera stopped, attendance stopped"})

@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        "camera_active": bool(camera_active),
        "attendance_active": bool(attendance_active),
        "people_in_database": len(database)
    })


# -------------------- Add Person Functionality --------------------
@app.route('/api/add_person', methods=['POST'])
def api_add_person():
    """Add a person to the database via uploaded images"""
    try:
        # Get the person's name from form data
        name = request.form.get('name')
        if not name or not name.strip():
            return jsonify({"error": "Person name is required"}), 400
            
        name = name.strip()
        
        # Get uploaded files
        if 'images' not in request.files:
            return jsonify({"error": "No images uploaded"}), 400
            
        files = request.files.getlist('images')
        if not files or len(files) == 0:
            return jsonify({"error": "No images uploaded"}), 400
            
        embeddings = []
        processed_count = 0
        errors = []
        
        # Process each uploaded image
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                embedding, error = process_uploaded_image(file)
                if embedding is not None:
                    embeddings.append(embedding)
                    processed_count += 1
                else:
                    errors.append(f"File {file.filename}: {error}")
                    
        if not embeddings:
            return jsonify({
                "error": "No valid faces detected in uploaded images",
                "details": errors
            }), 400
            
        # Add to database
        if name in database:
            database[name].extend(embeddings)
        else:
            database[name] = embeddings
            
        # Save database
        joblib.dump(database, DATABASE_PATH)
        
        response_data = {
            "status": "success",
            "message": f"Successfully added {name} to the database",
            "embeddings_added": len(embeddings),
            "images_processed": processed_count,
            "total_embeddings": len(database[name])
        }
        
        if errors:
            response_data["warnings"] = errors
            
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error in add_person: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/get_people', methods=['GET'])
def api_get_people():
    """Get list of people in the database"""
    try:
        people_info = []
        for name, embeddings in database.items():
            people_info.append({
                "name": name,
                "embedding_count": len(embeddings)
            })
            
        return jsonify({
            "people": people_info,
            "total_count": len(database)
        }), 200
        
    except Exception as e:
        print(f"Error in get_people: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/delete_person', methods=['DELETE'])
def api_delete_person():
    """Delete a person from the database"""
    try:
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({"error": "Person name is required"}), 400
            
        name = data['name'].strip()
        if not name:
            return jsonify({"error": "Person name is required"}), 400
            
        if name not in database:
            return jsonify({"error": f"Person '{name}' not found in database"}), 404
            
        # Remove from database
        del database[name]
        
        # Save database
        joblib.dump(database, DATABASE_PATH)
        
        return jsonify({
            "status": "success",
            "message": f"Successfully deleted {name} from the database"
        }), 200
        
    except Exception as e:
        print(f"Error in delete_person: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


if __name__ == "__main__":
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, threaded=True, port=5001)

