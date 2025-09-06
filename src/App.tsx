import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignInButton } from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import DepartmentList from './components/departments/DepartmentList'
import PeopleList from './components/people/PeopleList'
import Dashboard from './pages/Dashboard'
import UserSetup from './components/auth/UserSetup'
import ApprovalStatusHandler from './components/auth/ApprovalStatusHandler'
import { useAuth } from './hooks/useAuth'

// Admin Pages
import AnalyticsPage from './pages/admin/AnalyticsPage'
import ReportsPage from './pages/admin/ReportsPage'
import SettingsPage from './pages/admin/SettingsPage'
import ApprovalsPage from './pages/admin/ApprovalsPage'

// Teacher Pages
import ClassesPage from './pages/teacher/ClassesPage'
import StudentsPage from './pages/teacher/StudentsPage'
import AssignmentsPage from './pages/teacher/AssignmentsPage'
import GradesPage from './pages/teacher/GradesPage'
import SchedulePage from './pages/shared/SchedulePage'
import MessagesPage from './pages/shared/MessagesPage'

// Student Pages
import MyCoursesPage from './pages/student/MyCoursesPage'
import LibraryPage from './pages/student/LibraryPage'
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage'
import StudentGradesPage from './pages/student/StudentGradesPage'

// Shared Pages
import CoursesPage from './pages/shared/CoursesPage'
import AttendancePage from './pages/shared/AttendancePage'


function App() {
  const { isSignedIn, isLoaded, dbUser, approvalStatus, role } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600 mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-soft-xl p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                KNG
              </h1>
              <p className="text-secondary-600">
                Academic Management Platform
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-secondary-700 mb-6">
                Welcome! Please sign in to access your academic dashboard and manage your institution's data.
              </p>
              
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Sign In to Continue
                </button>
              </SignInButton>
              
              <p className="text-xs text-secondary-500 mt-4">
                Secure authentication powered by Clerk
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is signed in but no profile exists in our database, show setup
  if (isSignedIn && !dbUser) {
    return <UserSetup />;
  }

  // If user exists but is not approved (and not admin), show approval status
  if (isSignedIn && dbUser && approvalStatus !== "approved" && role !== "admin") {
    return (
      <ApprovalStatusHandler 
        approvalStatus={approvalStatus}
        userRole={role}
        userName={dbUser.full_name.split(' ')[0]}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="analytics" element={role === 'admin' ? <AnalyticsPage /> : <Navigate to="/" />} />
            <Route path="reports" element={role === 'admin' ? <ReportsPage /> : <Navigate to="/" />} />
            <Route path="settings" element={role === 'admin' ? <SettingsPage /> : <Navigate to="/" />} />
            <Route path="approvals" element={role === 'admin' ? <ApprovalsPage /> : <Navigate to="/" />} />
            <Route path="departments" element={role === 'admin' ? <DepartmentList /> : <Navigate to="/" />} />
            <Route path="people" element={role === 'admin' ? <PeopleList /> : <Navigate to="/" />} />
            
            {/* Teacher Routes */}
            <Route path="classes" element={role === 'teacher' ? <ClassesPage /> : <Navigate to="/" />} />
            <Route path="students" element={role === 'teacher' ? <StudentsPage /> : <Navigate to="/" />} />
            <Route path="assignments" element={role === 'teacher' ? <AssignmentsPage /> : <Navigate to="/" />} />
            <Route path="grades" element={role === 'teacher' ? <GradesPage /> : <Navigate to="/" />} />
            
            {/* Student Routes */}
            <Route path="my-courses" element={role === 'student' ? <MyCoursesPage /> : <Navigate to="/" />} />
            <Route path="library" element={role === 'student' ? <LibraryPage /> : <Navigate to="/" />} />
            <Route path="my-assignments" element={role === 'student' ? <StudentAssignmentsPage /> : <Navigate to="/" />} />
            <Route path="my-grades" element={role === 'student' ? <StudentGradesPage /> : <Navigate to="/" />} />
            
            {/* Shared Routes */}
            <Route path="courses" element={<CoursesPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="attendance" element={<AttendancePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
