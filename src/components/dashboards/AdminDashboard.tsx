import { motion } from 'framer-motion'
import {
  IoPersonOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoTrendingUpOutline,
  IoTimeOutline,
  IoStatsChartOutline,
  IoAddOutline,
  IoEyeOutline,
  IoShieldCheckmarkOutline,
  IoWalletOutline,
  IoNewspaperOutline,
  IoPersonAddOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'


const recentAdminActivities = [
  {
    id: 1,
    type: 'enrollment',
    title: 'New batch of 45 students enrolled',
    user: 'System',
    time: '2 minutes ago',
    icon: IoPersonOutline,
    priority: 'high'
  },
  {
    id: 2,
    type: 'staff',
    title: 'Dr. Emily Wilson joined as Physics Professor',
    user: 'HR Department',
    time: '1 hour ago',
    icon: IoPeopleOutline,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'finance',
    title: 'Monthly revenue target achieved',
    user: 'Finance Team',
    time: '3 hours ago',
    icon: IoWalletOutline,
    priority: 'high'
  },
  {
    id: 4,
    type: 'system',
    title: 'System maintenance completed successfully',
    user: 'IT Team',
    time: '1 day ago',
    icon: IoShieldCheckmarkOutline,
    priority: 'low'
  }
]

const adminQuickActions: Array<{
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
  showBadge?: boolean;
}> = [
  {
    title: 'Pending Approvals',
    description: 'Review user registrations',
    icon: IoPersonAddOutline,
    color: 'bg-orange-500',
    action: () => window.location.href = '/approvals',
    showBadge: true
  },
  {
    title: 'Add New Student',
    description: 'Register a new student',
    icon: IoPersonOutline,
    color: 'bg-blue-500',
    action: () => console.log('Add student')
  },
  {
    title: 'Hire Teacher',
    description: 'Add new faculty member',
    icon: IoPeopleOutline,
    color: 'bg-green-500',
    action: () => console.log('Hire teacher')
  },
  {
    title: 'Create Course',
    description: 'Set up a new course',
    icon: IoBookOutline,
    color: 'bg-purple-500',
    action: () => console.log('Create course')
  },
  {
    title: 'System Reports',
    description: 'View detailed analytics',
    icon: IoStatsChartOutline,
    color: 'bg-orange-500',
    action: () => console.log('View reports')
  },
  {
    title: 'Announcements',
    description: 'Send system-wide notifications',
    icon: IoNewspaperOutline,
    color: 'bg-indigo-500',
    action: () => console.log('Send announcement')
  },
  {
    title: 'Security Settings',
    description: 'Manage system security',
    icon: IoShieldCheckmarkOutline,
    color: 'bg-red-500',
    action: () => console.log('Security settings')
  }
]

export default function AdminDashboard() {
  const { dbUser } = useAuth()
  const pendingApprovalsCount = useQuery(api.people.getPendingApprovalsCount)
  
  // Fetch real data from the database
  const totalStudents = useQuery(api.people.getPeopleByRole, { role: 'student' })
  const totalTeachers = useQuery(api.people.getPeopleByRole, { role: 'teacher' })
  const allCourses = useQuery(api.courses.getAllCourses)
  const allDepartments = useQuery(api.departments.getAllDepartments)
  
  // Data seeding for development
  const seedDepartments = useMutation(api.seed.seedDepartments)
  const seedCourses = useMutation(api.seed.seedCourses)
  
  const handleSeedData = async () => {
    try {
      await seedDepartments({})
      await seedCourses({})
      alert('Sample data added successfully! Refresh the page to see the changes.')
    } catch (error) {
      console.error('Error seeding data:', error)
      alert('Error adding sample data. Check console for details.')
    }
  }
  
  // Calculate real statistics
  const getAdminStats = () => {
    const studentsCount = totalStudents?.length || 0
    const teachersCount = totalTeachers?.length || 0
    const coursesCount = allCourses?.length || 0
    const departmentsCount = allDepartments?.length || 0
    
    return [
      {
        title: 'Total Students',
        value: studentsCount === 0 ? '0' : studentsCount.toLocaleString(),
        change: studentsCount > 0 ? '+8.2%' : '0%',
        trend: 'up',
        icon: IoPersonOutline,
        color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      {
        title: 'Total Teachers',
        value: teachersCount === 0 ? '0' : teachersCount.toLocaleString(),
        change: teachersCount > 0 ? '+3.1%' : '0%',
        trend: 'up',
        icon: IoPeopleOutline,
        color: 'bg-gradient-to-r from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      },
      {
        title: 'Active Courses',
        value: coursesCount === 0 ? '0' : coursesCount.toLocaleString(),
        change: coursesCount > 0 ? '+12.5%' : '0%',
        trend: 'up',
        icon: IoBookOutline,
        color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      },
      {
        title: 'Total Departments',
        value: departmentsCount === 0 ? '0' : departmentsCount.toLocaleString(),
        change: departmentsCount > 0 ? '+15.3%' : '0%',
        trend: 'up',
        icon: IoWalletOutline,
        color: 'bg-gradient-to-r from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700'
      }
    ]
  }
  
  const adminStatsData = getAdminStats()
  
  // Loading state
  if (totalStudents === undefined || totalTeachers === undefined || allCourses === undefined || allDepartments === undefined) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4 sm:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent leading-tight break-words">
            Welcome back, {dbUser?.full_name?.split(' ')[0] || 'User'}! 👨‍💼
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg break-words">
            Here's your institution's comprehensive overview and management tools.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg w-full sm:w-auto whitespace-nowrap">
            <IoEyeOutline className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl w-full sm:w-auto whitespace-nowrap">
            <IoAddOutline className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Quick Actions</span>
            <span className="sm:hidden">Actions</span>
          </Button>
          {/* Development seed data button */}
          {import.meta.env.DEV && (
            <Button 
              onClick={handleSeedData}
              variant="outline" 
              size="lg" 
              className="shadow-md hover:shadow-lg w-full sm:w-auto whitespace-nowrap border-green-300 text-green-700 hover:bg-green-50"
            >
              <IoAddOutline className="w-5 h-5 mr-2" />
              Add Sample Data
            </Button>
          )}
        </div>
      </div>

      {/* Empty Data Information Banner */}
      {(totalStudents?.length === 0 && totalTeachers?.length === 0 && allCourses?.length === 0 && allDepartments?.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <IoStatsChartOutline className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Welcome to Your Academic Management System!</h3>
          </div>
          <p className="text-blue-700 mb-3">
            Your dashboard is ready, but you don't have any data yet. Get started by adding some sample data to see how everything works.
          </p>
          {import.meta.env.DEV && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSeedData}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <IoAddOutline className="w-4 h-4 mr-2" />
                Add Sample Data
              </Button>
              <span className="text-sm text-blue-600">This will add departments and courses for testing.</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats Cards */}
    {/* Stats Cards - Vertical Layout */}
<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {adminStatsData.map((stat, index) => (
    <motion.div
      key={stat.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden w-full flex flex-col">
        <div className={`h-2 ${stat.color}`}></div>
        <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
          <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
            <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
          </div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          <div className="flex items-center gap-1 text-green-600 text-base font-semibold">
            <IoTrendingUpOutline className="w-4 h-4" />
            <span>{stat.change}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>


      {/* Main Content Grid */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 min-w-0"
        >
          <Card className="shadow-xl border-0 w-full overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <IoTimeOutline className="w-6 h-6 text-white" />
                </div>
                Recent System Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              {recentAdminActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 w-full"
                >
                  <div className={`p-3 rounded-xl shrink-0 ${
                    activity.priority === 'high' ? 'bg-red-100 text-red-600' :
                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">{activity.title}</p>
                    <p className="text-gray-600 text-sm sm:text-base truncate">by {activity.user}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{activity.time}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap ${
                    activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activity.priority}
                  </div>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-lg py-3">
                  View All System Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="min-w-0"
        >
          <Card className="shadow-xl border-0 w-full overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <IoStatsChartOutline className="w-6 h-6 text-white" />
                </div>
                Admin Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
              {adminQuickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 sm:p-4 h-auto hover:bg-gray-50 hover:shadow-md transition-all relative"
                    onClick={action.action}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                      <div className={`p-2 sm:p-3 ${action.color} rounded-lg sm:rounded-xl text-white shadow-lg shrink-0`}>
                        <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="text-left flex-1 min-w-0 overflow-hidden">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base truncate break-words overflow-hidden">{action.title}</div>
                        <div className="text-xs sm:text-sm text-gray-600 truncate break-words overflow-hidden">{action.description}</div>
                      </div>
                      {action.showBadge && pendingApprovalsCount && pendingApprovalsCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shrink-0">
                          {pendingApprovalsCount > 99 ? '99+' : pendingApprovalsCount}
                        </div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
