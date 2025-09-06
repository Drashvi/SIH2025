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
from functools import wraps
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
import traceback

# -------------------- Load env --------------------
load_dotenv()
API_KEY = os.environ.get("API_KEY")  # set in your .env

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# -------------------- Config --------------------
DATABASE_PATH = "face_database_multiple.joblib"
ATTENDANCE_FOLDER = "./"
THRESHOLD = 0.75
KNN_NEIGHBORS = 5
BOX_DISPLAY_TIME = 2  # seconds
CAPTURE_COUNT = 150
FRAME_SKIP_INTERVAL = 5 # Process every 5th frame
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
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

# -------------------- Helpers --------------------
def require_api_key(view_func):
    @wraps(view_func)
    def wrapped(*args, **kwargs):
        key = request.headers.get("x-api-key")
        if not API_KEY:
            return jsonify({"error": "Server misconfigured (no API_KEY set)."}), 500
        if not key or key != API_KEY:
            return jsonify({"error": "Unauthorized"}), 401
        return view_func(*args, **kwargs)
    return wrapped

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
            if frame_count % FRAME_SKIP_INTERVAL != 0:
                # Still send the frame, but don't process for faces
                ret, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                continue

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            faces = detector.detect_faces(rgb)
            current_time = datetime.now()

            if faces:
                f = faces[0]
                x, y, w, h = f.get('box', (0,0,0,0))
                x, y = max(0, x), max(0, y)
                w, h = max(1, w), max(1, h)
                roi = rgb[y:y+h, x:x+w]

                if roi.size != 0:
                    try:
                        face_resized = cv2.resize(roi, (160, 160))
                        emb = embedder.embeddings([face_resized])[0]
                        name = recognize_face(emb, database)
                        color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)

                        if name != "Unknown" and attendance_active:
                            mark_attendance(name)
                            display_timers[name] = current_time + timedelta(seconds=BOX_DISPLAY_TIME)

                        if name in display_timers and current_time <= display_timers[name]:
                            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                            cv2.putText(frame, name, (x, y-10),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                    except Exception:
                        # skip any bad frame
                        pass

            # encode and yield
            try:
                ret, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            except Exception:
                continue
    finally:
        cap.release()

# -------------------- Routes (UI) --------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start')
def start_camera():
    global camera_active
    camera_active = True
    return redirect(url_for('index'))

@app.route('/stop')
def stop_camera():
    global camera_active, attendance_active
    camera_active = False
    attendance_active = False
    return redirect(url_for('index'))

@app.route('/toggle_attendance')
def toggle_attendance():
    global attendance_active
    attendance_active = not attendance_active
    return redirect(url_for('index'))

# -------------------- Admin page --------------------
@app.route('/admin')
def admin():
    msg = request.args.get('msg')
    records = []
    if os.path.exists(filename):
        with open(filename, "r") as f:
            reader = csv.reader(f)
            records = list(reader)
    return render_template('admin.html', records=records, msg=msg, camera_active=bool(camera_active))

# -------------------- Add person via file upload (/add_person) --------------------
@app.route('/add_person', methods=['POST'])
def add_person_upload():
    try:
        name = request.form.get('name')
        if not name:
            return redirect(url_for('admin', msg="Error: Name is required."))

        images = request.files.getlist('images')
        if not images or len(images) == 0:
            return redirect(url_for('admin', msg="Error: No images uploaded."))

        embeddings = []
        saved_count = 0
        for file in images:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                saved_count += 1

                # read and process
                img = cv2.imread(filepath)
                if img is None:
                    continue
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                faces = detector.detect_faces(rgb)
                if not faces:
                    continue
                x, y, w, h = faces[0].get('box', (0,0,0,0))
                x, y = max(0, x), max(0, y)
                w, h = max(1, w), max(1, h)
                roi = rgb[y:y+h, x:x+w]
                if roi.size == 0:
                    continue
                try:
                    face_resized = cv2.resize(roi, (160, 160))
                    emb = embedder.embeddings([face_resized])[0]
                    embeddings.append(emb)
                except Exception:
                    continue

        if not embeddings:
            return redirect(url_for('admin', msg="No faces detected in uploaded images."))

        if name in database:
            database[name].extend(embeddings)
        else:
            database[name] = embeddings
        joblib.dump(database, DATABASE_PATH)
        return redirect(url_for('admin', msg=f"{name} added with {len(embeddings)} embeddings (from {saved_count} files)."))
    except Exception as e:
        traceback.print_exc()
        return redirect(url_for('admin', msg=f"Error during upload: {str(e)}"))

# -------------------- Capture person via camera (/capture_person) --------------------
@app.route('/capture_person', methods=['POST'])
def capture_person():
    global camera_active
    try:
        name = request.form.get('name')
        if not name:
            return redirect(url_for('admin', msg="Error: Name is required."))

        # Prevent conflict if camera is already streaming
        if camera_active:
            return redirect(url_for('admin', msg="Error: Camera is active for attendance. Stop it before adding a person."))

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            return redirect(url_for('admin', msg="Error: Could not open camera."))

        embeddings = []
        count = 0
        try:
            while count < CAPTURE_COUNT:
                ret, frame = cap.read()
                if not ret or frame is None:
                    break

                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                faces = detector.detect_faces(rgb)

                if faces:
                    x, y, w, h = faces[0].get('box', (0,0,0,0))
                    x, y = max(0, x), max(0, y)
                    w, h = max(1, w), max(1, h)
                    roi = rgb[y:y+h, x:x+w]
                    if roi.size == 0:
                        continue
                    try:
                        face_resized = cv2.resize(roi, (160, 160))
                        emb = embedder.embeddings([face_resized])[0]
                        embeddings.append(emb)
                        count += 1
                    except Exception:
                        continue
        finally:
            cap.release()

        if not embeddings:
            return redirect(url_for('admin', msg="No faces captured."))

        if name in database:
            database[name].extend(embeddings)
        else:
            database[name] = embeddings
        joblib.dump(database, DATABASE_PATH)
        return redirect(url_for('admin', msg=f"{name} added with {len(embeddings)} embeddings (camera)."))
    except Exception as e:
        traceback.print_exc()
        return redirect(url_for('admin', msg=f"Error during capture: {str(e)}"))

# -------------------- API: Capture via camera (JSON) --------------------
@app.route('/api/capture_person', methods=['POST'])
@require_api_key
def api_capture_person():
    try:
        data = request.get_json()
        if not data or "name" not in data:
            return jsonify({"error": "Name is required"}), 400

        name = data["name"]

        # Prevent conflict if camera is already streaming
        if camera_active:
            return jsonify({"error": "Camera is active for attendance. Stop it before adding a person."}), 400

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            return jsonify({"error": "Could not open camera."}), 500

        embeddings = []
        count = 0
        try:
            while count < CAPTURE_COUNT:
                ret, frame = cap.read()
                if not ret or frame is None:
                    break
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                faces = detector.detect_faces(rgb)
                if faces:
                    x, y, w, h = faces[0].get('box', (0,0,0,0))
                    x, y = max(0, x), max(0, y)
                    w, h = max(1, w), max(1, h)
                    roi = rgb[y:y+h, x:x+w]
                    if roi.size == 0:
                        continue
                    try:
                        face_resized = cv2.resize(roi, (160, 160))
                        emb = embedder.embeddings([face_resized])[0]
                        embeddings.append(emb)
                        count += 1
                    except Exception:
                        continue
        finally:
            cap.release()

        if not embeddings:
            return jsonify({"error": "No faces captured"}), 400

        if name in database:
            database[name].extend(embeddings)
        else:
            database[name] = embeddings
        joblib.dump(database, DATABASE_PATH)
        return jsonify({"status": f"{name} added successfully", "embeddings_count": len(embeddings)})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -------------------- Secure API endpoints --------------------
@app.route('/api/start', methods=['POST'])
@require_api_key
def api_start():
    global camera_active, attendance_active
    camera_active = True
    attendance_active = True
    return jsonify({"status": "Camera started, attendance active"})

@app.route('/api/stop', methods=['POST'])
@require_api_key
def api_stop():
    global camera_active, attendance_active
    camera_active = False
    attendance_active = False
    return jsonify({"status": "Camera stopped, attendance stopped"})

@app.route('/api/attendance', methods=['GET'])
@require_api_key
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
@require_api_key
def api_status():
    return jsonify({
        "camera_active": bool(camera_active),
        "attendance_active": bool(attendance_active),
        "people_in_database": len(database)
    })

if __name__ == "__main__":
    app.run(debug=True)