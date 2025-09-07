from flask import Flask, render_template, Response, request, redirect, url_for, jsonify
import cv2
import joblib
import numpy as np
import os
import csv
from keras_facenet import FaceNet
from mtcnn import MTCNN
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename
import traceback


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://localhost:5175"]}})

# -------------------- Config --------------------
DATABASE_PATH = "face_database_multiple.joblib"
ATTENDANCE_FOLDER = "./"
THRESHOLD = 0.75
KNN_NEIGHBORS = 5
BOX_DISPLAY_TIME = 2  # seconds
CAPTURE_COUNT = 150
FRAME_SKIP_INTERVAL = 5 # Process every 5th frame
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# -------------------- Load DB --------------------
if os.path.exists(DATABASE_PATH):
    try:
        database = joblib.load(DATABASE_PATH)
        print(f"Loaded database with {len(database)} people")
    except Exception:
        database = {}
else:
    database = {}

embedder = FaceNet()
detector = MTCNN()

# -------------------- Attendance CSV --------------------
date_str = datetime.now().strftime("%Y-%m-%d")
filename = os.path.join(ATTENDANCE_FOLDER, f"attendance_{date_str}.csv")
if not os.path.exists(filename):
    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Time"])

marked = set()
display_timers = {}

# Control flags
camera_active = False
attendance_active = False


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
        faces = detector.detect_faces(rgb)
        
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
        embedding = embedder.embeddings([face_resized])[0]
        
        # Clean up temporary file
        os.remove(filepath)
        
        return embedding, None
        
    except Exception as e:
        # Clean up temporary file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return None, f"Error processing image: {str(e)}"

def mark_attendance(name):
    if attendance_active and name not in marked and name != "Unknown":
        now = datetime.now().strftime("%H:%M:%S")
        with open(filename, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([name, now])
        marked.add(name)
        print(f"{name} marked at {now}")

def recognize_face(face_embedding, database, threshold=THRESHOLD, k_neighbors=KNN_NEIGHBORS):
    best_score, best_person = -1, "Unknown"
    for person, embeddings_list in database.items():
        if len(embeddings_list) == 0:
            continue
        k = min(k_neighbors, len(embeddings_list))
        try:
            sims = cosine_similarity([face_embedding], embeddings_list)
            top_k_sim = np.sort(sims[0])[-k:]
            max_sim = np.mean(top_k_sim)
        except Exception:
            continue
        if max_sim > best_score:
            best_score = max_sim
            best_person = person
    if best_score < threshold:
        return "Unknown"
    return best_person

def generate_frames():
    global camera_active, attendance_active
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        # If camera can't open, stop streaming
        camera_active = False
        return

    try:
        frame_count = 0
        while camera_active:
            success, frame = cap.read()
            if not success or frame is None:
                break

            frame_count += 1
            current_time = datetime.now()
            
            # Process every frame for face detection (remove frame skipping for better detection)
            try:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                faces = detector.detect_faces(rgb)

                # Process all detected faces, not just the first one
                for face in faces:
                    x, y, w, h = face.get('box', (0, 0, 0, 0))
                    confidence = face.get('confidence', 0)
                    
                    # Only process faces with good confidence (> 0.9)
                    if confidence > 0.9:
                        x, y = max(0, x), max(0, y)
                        x2, y2 = min(frame.shape[1], x + w), min(frame.shape[0], y + h)
                        w, h = x2 - x, y2 - y
                        
                        if w > 30 and h > 30:  # Minimum face size
                            roi = rgb[y:y+h, x:x+w]
                            
                            if roi.size > 0:
                                try:
                                    # Ensure ROI has correct shape
                                    if len(roi.shape) == 3 and roi.shape[2] == 3:
                                        face_resized = cv2.resize(roi, (160, 160))
                                        emb = embedder.embeddings([face_resized])[0]
                                        name = recognize_face(emb, database)
                                        
                                        # Always draw bounding box for detected faces
                                        if name != "Unknown":
                                            color = (0, 255, 0)  # Green for known faces
                                            if attendance_active:
                                                mark_attendance(name)
                                            display_timers[name] = current_time + timedelta(seconds=BOX_DISPLAY_TIME)
                                        else:
                                            color = (0, 0, 255)  # Red for unknown faces
                                        
                                        # Draw rectangle and label
                                        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                                        
                                        # Add background for text readability
                                        label = f"{name} ({confidence:.2f})"
                                        label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
                                        cv2.rectangle(frame, (x, y-label_size[1]-10), (x+label_size[0], y), color, -1)
                                        cv2.putText(frame, label, (x, y-5),
                                                  cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                                        
                                except Exception as e:
                                    print(f"Face processing error: {e}")
                                    # Still draw a basic detection box
                                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                                    cv2.putText(frame, "Processing...", (x, y-5),
                                              cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
                            
            except Exception as e:
                print(f"Face detection error: {e}")
                pass

            # encode and yield
            try:
                ret, buffer = cv2.imencode('.jpg', frame)
                if ret:
                    frame_bytes = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            except Exception as e:
                print(f"Frame encoding error: {e}")
                continue
    finally:
        cap.release()

# -------------------- Routes (UI) --------------------
# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/api/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/start')
# def start_camera():
#     global camera_active
#     camera_active = True
#     return redirect(url_for('index'))

# @app.route('/stop')
# def stop_camera():
#     global camera_active, attendance_active
#     camera_active = False
#     attendance_active = False
#     return redirect(url_for('index'))

# @app.route('/toggle_attendance')
# def toggle_attendance():
#     global attendance_active
#     attendance_active = not attendance_active
#     return redirect(url_for('index'))


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

# -------------------- API: Capture via camera (JSON) --------------------

# -------------------- Secure API endpoints --------------------
@app.route('/api/start', methods=['POST'])
def api_start():
    global camera_active, attendance_active
    camera_active = True
    attendance_active = True
    return jsonify({"status": "Camera started, attendance active"})

@app.route('/api/stop', methods=['POST'])
def api_stop():
    global camera_active, attendance_active
    camera_active = False
    attendance_active = False
    return jsonify({"status": "Camera stopped, attendance stopped"})

@app.route('/api/attendance', methods=['GET'])
def api_attendance():
    records = []
    if os.path.exists(filename):
        with open(filename, "r") as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                records.append({"name": row[0], "time": row[1]})
    return jsonify({"date": date_str, "records": records})

@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        "camera_active": bool(camera_active),
        "attendance_active": bool(attendance_active),
        "people_in_database": len(database)
    })

if __name__ == "__main__":
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, host='127.0.0.1', port=5000, threaded=True)
