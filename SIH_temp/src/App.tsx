import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignInButton } from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UserSetup from './components/auth/UserSetup'
import ApprovalStatusHandler from './components/auth/ApprovalStatusHandler'
import { useAuth } from './hooks/useAuth'

// Admin Pages
import AnalyticsPage from './pages/admin/AnalyticsPage'
import ReportsPage from './pages/admin/ReportsPage'
import SettingsPage from './pages/admin/SettingsPage'
import ApprovalsPage from './pages/admin/ApprovalsPage'
import DepartmentsPage from './pages/admin/DepartmentsPage'
import PeoplePage from './pages/admin/PeoplePage'

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
  
  
  // Create a route protection component
  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: string }) => {
    if (!isLoaded) {
      return <div>Loading...</div>
    }
    
    if (role === requiredRole) {
      return <>{children}</>
    }
    
    return <Navigate to="/" replace />
  }

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
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-2 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
        </div>

        <div className="w-full max-w-7xl h-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
            {/* Left Column - Campus Image and University Info */}
            <div className="flex flex-col h-full justify-center space-y-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="KNG University main campus"
                    className="w-full h-[280px] lg:h-[320px] rounded-2xl object-cover shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">Live Campus</span>
                    </div>
                    <h3 className="text-xl font-bold">KNG University</h3>
                    <p className="text-white/80 text-xs">Main Campus Building</p>
                  </div>
                </div>
              </div>
              
              <div className="max-w-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      Welcome to KNG
                    </h2>
                    <p className="text-blue-200 font-medium">University</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed text-sm mb-4">
                  KNG University is a forward-looking institution committed to excellence in teaching, research, and community impact. Located in the heart of our city, we unite bright minds, modern labs, and industry partnerships to create meaningful outcomes.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center">
                      <span className="text-blue-400 text-xs">🔬</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-xs">Research Labs</p>
                      <p className="text-gray-400 text-xs">Modern</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-md flex items-center justify-center">
                      <span className="text-purple-400 text-xs">🤝</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-xs">Partnerships</p>
                      <p className="text-gray-400 text-xs">Industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center">
                      <span className="text-green-400 text-xs">🌍</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-xs">Community</p>
                      <p className="text-gray-400 text-xs">Inclusive</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Sign In Card */}
            <div className="flex justify-center items-center h-full">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 text-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    {/* Logo and title */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-2xl font-bold text-white">🎓</span>
              </div>
                      <h1 className="text-2xl font-bold text-white mb-2">
                        KNG Platform
              </h1>
                      <p className="text-blue-200 font-medium mb-1">
                        Academic Management System
                      </p>
                      <p className="text-gray-400 text-sm">
                        Streamline your academic journey
              </p>
            </div>
            
            <div className="space-y-4">
              <SignInButton mode="modal">
                        <button className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative flex items-center justify-center space-x-2">
                            <span>Sign In to Continue</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                </button>
              </SignInButton>
              
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>Secure</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <span>Powered by Clerk</span>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <span>Enterprise Grade</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <Route path="departments" element={role === 'admin' ? <DepartmentsPage /> : <Navigate to="/" />} />
            <Route path="people" element={role === 'admin' ? <PeoplePage /> : <Navigate to="/" />} />
            
            {/* Teacher Routes */}
            <Route path="classes" element={<ProtectedRoute requiredRole="teacher"><ClassesPage /></ProtectedRoute>} />
            <Route path="students" element={<ProtectedRoute requiredRole="teacher"><StudentsPage /></ProtectedRoute>} />
            <Route path="assignments" element={<ProtectedRoute requiredRole="teacher"><AssignmentsPage /></ProtectedRoute>} />
            <Route path="grades" element={<ProtectedRoute requiredRole="teacher"><GradesPage /></ProtectedRoute>} />
            
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
