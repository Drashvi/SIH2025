import { useAuth } from '../hooks/useAuth'
import AdminDashboard from '../components/dashboards/AdminDashboard'
import TeacherDashboard from '../components/dashboards/TeacherDashboard'
import StudentDashboard from '../components/dashboards/StudentDashboard'

export default function Dashboard() {
  const { role } = useAuth()

  // Route to role-specific dashboard
  switch (role) {
    case 'admin':
      return <AdminDashboard />
    case 'teacher':
      return <TeacherDashboard />
    case 'student':
      return <StudentDashboard />
    default:
      return <StudentDashboard />
  }
}
