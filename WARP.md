# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an Academic Management System built for Smart India Hackathon 2025. It combines a modern React frontend with a Flask-based face recognition backend for automated attendance tracking.

**Key Technologies:**
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Convex (real-time database) + Flask (face recognition API)
- Authentication: Clerk
- Face Recognition: TensorFlow + Keras FaceNet + MTCNN
- Deployment: Vite dev server + Flask development server

## Architecture

### Frontend Architecture (React + Convex)
- **Role-based system**: Three user types (student, teacher, admin) with different permissions
- **Real-time data**: Convex provides live synchronization across all clients
- **Component structure**: Organized by feature (attendance, people, courses, departments)
- **Authentication flow**: Clerk handles auth → custom user setup → role assignment → approval workflow

### Backend Architecture (Flask + AI Model)
- **Face recognition pipeline**: MTCNN detection → FaceNet embedding → cosine similarity matching
- **Database**: Joblib-serialized face embeddings with KNN-based recognition
- **API endpoints**: Camera control, attendance marking, face enrollment
- **File handling**: Image uploads for face registration

### Database Schema (Convex)
The system uses a relational approach with these key entities:
- **people**: Unified table for students/teachers/admins with role-specific fields
- **departments**: Academic departments with head/liaison assignments  
- **courses**: Course offerings linked to departments and teachers
- **attendance**: Records linking students, courses, teachers, and timestamps

## Common Commands

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend/Model Development  
```bash
# Set up Python environment (first time)
cd model
python -m venv .venv
source .venv/bin/activate  # On macOS/Linux
pip install -r requirement.txt

# Start Flask face recognition server
cd model
python main.py

# Start optimized version
python main_optimized.py
```

### Database Management (Convex)
```bash
# Start Convex development server
npx convex dev

# Deploy schema changes
npx convex deploy

# Run database functions
npx convex run <function_name>
```

## Development Workflow

### Setting up Authentication
1. Create Clerk application at dashboard.clerk.com
2. Copy keys to `.env.local`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
3. The app handles user registration → role selection → admin approval flow

### Face Recognition Setup
1. Ensure camera permissions are granted
2. Face database is stored in `model/face_database_multiple.joblib`
3. Upload folder at `model/uploads/` for temporary image processing
4. Attendance CSVs are generated daily in `model/` directory

### Adding New Users
- Users sign up through Clerk authentication
- Complete profile setup by selecting role (student/teacher/admin)
- Admin must approve new users before they gain full access
- Students/teachers get assigned to departments and courses

## Key Implementation Details

### Real-time Features
- Convex subscriptions automatically update UI when data changes
- Attendance marking immediately reflects across all connected clients
- No manual refresh needed - data stays synchronized

### Face Recognition Pipeline
1. **Detection**: MTCNN finds faces in camera feed
2. **Embedding**: FaceNet generates 128-dimensional face vectors  
3. **Matching**: Cosine similarity with KNN averaging against database
4. **Threshold**: 0.75 similarity threshold for positive identification

### Role-Based Access Control
- Navigation menus filter based on user role
- API endpoints check user permissions via Clerk integration
- Database queries respect role boundaries

### File Organization
- `/src/components/` - Reusable UI components organized by feature
- `/src/pages/` - Route components split by user role (admin/teacher/student)
- `/convex/` - Database schema and server functions
- `/model/` - Python Flask server and ML model files

## Development Environment

### Required Ports
- Frontend: `http://localhost:5173` (Vite dev server)
- Face Recognition API: `http://localhost:5000` (Flask server)
- Convex: Auto-configured via environment variables

### Environment Variables
Frontend (`.env.local`):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CONVEX_DEPLOYMENT=dev:...
VITE_CONVEX_URL=https://...convex.cloud
```

Model (`.env`):
```
FLASK_ENV=development
```

## Testing Face Recognition

1. Start both servers (`npm run dev` and `python model/main.py`)
2. Navigate to attendance page as teacher
3. Click "Start Camera" to begin face detection
4. Use "Register Face" to add new faces to database
5. Toggle "Mark Attendance" to enable automatic attendance logging

The system processes every frame for detection and maintains a face database for recognition across sessions.
