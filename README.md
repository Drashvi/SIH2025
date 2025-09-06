# Academic Management System

A comprehensive academic management system built with React, TypeScript, Vite, Convex database, and Clerk authentication.

## Features

- **User Management**: Students, Teachers, and Admins with role-based access
- **Department Management**: Create and manage academic departments
- **Course Management**: Manage courses with teacher assignments
- **People Management**: Comprehensive profiles for all user types
- **Attendance Tracking**: Mark and track attendance for courses
- **Real-time Database**: Uses Convex for real-time data synchronization
- **Authentication**: Secure authentication with Clerk

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Database**: Convex (Real-time database)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Database Schema

The system follows the ER diagram provided with the following entities:

### Departments
- Department name
- Head of department (Teacher)
- Liaison teacher (optional)

### People (Students/Teachers/Admins)
- Basic info: Name, email, phone, role
- **Students**: Enrollment number, semester, department, gender, micro/minor specializations
- **Teachers**: Department, subject assigned, additional courses
- **Admins**: Admin role/position

### Courses
- Course ID, name, semester, credits
- Department and teacher assignments

### Attendance
- Student, course, teacher (marker), date, status
- Status: Present (P), Absent (A), Late (L), Excused (E)
- Optional remarks

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will:
- Set up your Convex project
- Generate the necessary type definitions
- Start the Convex development server

### 3. Set up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Update `.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### First Time Setup

1. **Sign Up/In**: Use the Clerk authentication to create an account
2. **Profile Setup**: Complete your profile setup by selecting your role (Student/Teacher/Admin)
3. **Access Dashboard**: Once set up, you'll have access to the appropriate dashboard features

### Admin Features

- **Dashboard**: Overview of system statistics
- **Departments**: Create and manage departments
- **Courses**: Manage course offerings
- **People**: Manage all users (students, teachers, admins)
- **Attendance**: View all attendance records

### Teacher Features

- **Dashboard**: Personal overview
- **Courses**: View assigned courses
- **People**: View students in their department
- **Attendance**: Mark attendance for their courses

### Student Features

- **Dashboard**: Personal overview
- **Attendance**: View their attendance records

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard layout and components
│   ├── departments/    # Department management
│   ├── people/         # People management
│   ├── courses/        # Course management
│   └── attendance/     # Attendance management
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

convex/
├── schema.ts           # Database schema definition
├── departments.ts      # Department CRUD operations
├── people.ts          # People CRUD operations
├── courses.ts         # Course CRUD operations
└── attendance.ts      # Attendance CRUD operations
```

## Key Features Explained

### Role-Based Access Control

The system uses Clerk for authentication and custom database records to manage roles:
- Each user has a role: `student`, `teacher`, or `admin`
- Navigation and features are filtered based on user roles
- Database queries respect user permissions

### Real-time Updates

Convex provides real-time database synchronization:
- Changes are immediately reflected across all connected clients
- No manual refresh needed
- Optimistic updates for better user experience

### Comprehensive User Profiles

Different user types have specific fields:
- **Students**: Enrollment numbers, semester, department assignments
- **Teachers**: Department affiliations, subject assignments
- **Admins**: Administrative roles and permissions

### Attendance Management

- Teachers can mark attendance for their courses
- Support for different status types (Present, Absent, Late, Excused)
- Bulk attendance operations
- Statistical reporting

## Development

### Adding New Features

1. **Database Changes**: Update `convex/schema.ts` and create corresponding CRUD functions
2. **Types**: Update `src/types/index.ts` for TypeScript support
3. **Components**: Create new components following the existing pattern
4. **Routing**: Add routes in `src/App.tsx`

### Environment Variables

Required environment variables:

```env
# Convex (auto-generated)
CONVEX_DEPLOYMENT=dev:your-deployment
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
