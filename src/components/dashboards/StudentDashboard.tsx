import { motion } from 'framer-motion'
import {
  IoSchoolOutline,
  IoBookOutline,
  IoTrophyOutline,
  IoClipboardOutline,
  IoCalendarOutline,
  IoChatboxOutline,
  IoLibraryOutline,
  IoTimeOutline,
  IoStatsChartOutline,
  IoNotificationsOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoAlarmOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'

// Student-specific mock data
const studentStatsData = [
  {
    title: 'My Courses',
    value: '8',
    subtitle: 'Currently Enrolled',
    icon: IoSchoolOutline,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    title: 'Overall GPA',
    value: '3.7',
    subtitle: 'Current Semester',
    icon: IoTrophyOutline,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  },
  {
    title: 'Assignments',
    value: '12',
    subtitle: 'Due This Week',
    icon: IoClipboardOutline,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  {
    title: 'Attendance',
    value: '92%',
    subtitle: 'This Semester',
    icon: IoCheckmarkCircleOutline,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  }
]

const upcomingClasses = [
  {
    id: 1,
    time: '9:00 AM',
    subject: 'Data Structures',
    instructor: 'Dr. Smith',
    room: 'Room 301',
    status: 'next',
    duration: '1h 30m'
  },
  {
    id: 2,
    time: '11:00 AM',
    subject: 'Database Systems',
    instructor: 'Prof. Johnson',
    room: 'Lab 205',
    status: 'upcoming',
    duration: '2h'
  },
  {
    id: 3,
    time: '2:00 PM',
    subject: 'Software Engineering',
    instructor: 'Dr. Williams',
    room: 'Room 108',
    status: 'upcoming',
    duration: '1h 30m'
  }
]

const recentStudentActivities = [
  {
    id: 1,
    type: 'assignment',
    title: 'Assignment submitted: Data Structures Project',
    course: 'Data Structures',
    time: '2 hours ago',
    icon: IoClipboardOutline,
    status: 'completed'
  },
  {
    id: 2,
    type: 'grade',
    title: 'New grade received: Database Design (A-)',
    course: 'Database Systems',
    time: '1 day ago',
    icon: IoTrophyOutline,
    status: 'success'
  },
  {
    id: 3,
    type: 'announcement',
    title: 'New announcement from Software Engineering',
    course: 'Software Engineering',
    time: '2 days ago',
    icon: IoNotificationsOutline,
    status: 'info'
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Reminder: Math Quiz tomorrow at 10 AM',
    course: 'Mathematics',
    time: '3 days ago',
    icon: IoWarningOutline,
    status: 'warning'
  }
]

const assignmentsDue = [
  {
    id: 1,
    title: 'Algorithm Analysis Report',
    course: 'Data Structures',
    dueDate: 'Tomorrow',
    priority: 'high',
    progress: 75
  },
  {
    id: 2,
    title: 'Database Design Project',
    course: 'Database Systems',
    dueDate: 'In 3 days',
    priority: 'medium',
    progress: 40
  },
  {
    id: 3,
    title: 'Software Requirements Document',
    course: 'Software Engineering',
    dueDate: 'Next week',
    priority: 'low',
    progress: 10
  }
]

const studentQuickActions = [
  {
    title: 'View Schedule',
    description: 'Check today\'s classes',
    icon: IoCalendarOutline,
    color: 'bg-blue-500',
    action: () => console.log('View schedule')
  },
  {
    title: 'Submit Assignment',
    description: 'Upload your work',
    icon: IoClipboardOutline,
    color: 'bg-green-500',
    action: () => console.log('Submit assignment')
  },
  {
    title: 'Check Grades',
    description: 'View your performance',
    icon: IoTrophyOutline,
    color: 'bg-yellow-500',
    action: () => console.log('Check grades')
  },
  {
    title: 'Library Resources',
    description: 'Access study materials',
    icon: IoLibraryOutline,
    color: 'bg-purple-500',
    action: () => console.log('Library resources')
  },
  {
    title: 'Contact Teacher',
    description: 'Send a message',
    icon: IoChatboxOutline,
    color: 'bg-indigo-500',
    action: () => console.log('Contact teacher')
  }
]

export default function StudentDashboard() {
  const { dbUser } = useAuth()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'next':
        return 'border-l-4 border-green-500 bg-green-50'
      case 'upcoming':
        return 'border-l-4 border-blue-500 bg-blue-50'
      default:
        return 'border-l-4 border-gray-300 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600'
      case 'success':
        return 'bg-blue-100 text-blue-600'
      case 'info':
        return 'bg-purple-100 text-purple-600'
      case 'warning':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight break-words truncate overflow-hidden">
            Welcome back, {dbUser?.full_name?.split(' ')[0] || 'User'}! 👨‍💼
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg break-words truncate overflow-hidden">
            Here's your institution's comprehensive overview and management tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg">
            <IoCalendarOutline className="w-5 h-5 mr-2" />
            My Schedule
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl">
            <IoNotificationsOutline className="w-5 h-5 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStatsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className={`h-2 ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
<p className="text-sm font-semibold text-gray-600 uppercase tracking-wider truncate\">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 truncate\">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1 truncate\">{stat.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Classes and Assignments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Today's Classes */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <IoCalendarOutline className="w-6 h-6 text-white" />
                </div>
                Today's Classes
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {upcomingClasses.map((class_, index) => (
                <motion.div
                  key={class_.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-xl ${getStatusColor(class_.status)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[70px]">
                        <p className="font-bold text-gray-900">{class_.time}</p>
                        <p className="text-xs text-gray-600">{class_.duration}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">{class_.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="truncate">👨‍🏫 {class_.instructor}</span>
                          <span className="truncate">📍 {class_.room}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {class_.status === 'next' ? (
                        <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                          <IoAlarmOutline className="w-4 h-4" />
                          Next Class
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          <IoBookOutline className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Assignments Due */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <IoClipboardOutline className="w-6 h-6 text-white" />
                </div>
                Assignments Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {assignmentsDue.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(assignment.priority)}`}></div>
                      <span className="text-sm font-medium text-gray-700">{assignment.dueDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{assignment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getPriorityColor(assignment.priority)}`}
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-purple-50 border-b">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <IoStatsChartOutline className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {studentQuickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-gray-50 hover:shadow-md transition-all"
                    onClick={action.action}
                  >
                    <div className="flex items-center gap-3 w-full min-w-0">
                      <div className={`p-2 ${action.color} rounded-lg text-white shadow-md`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{action.title}</div>
                        <div className="text-xs text-gray-600 truncate">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-green-500 rounded-lg">
                  <IoTimeOutline className="w-5 h-5 text-white" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {recentStudentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActivityStatusColor(activity.status)}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{activity.title}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.course}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-sm py-2">
                  View All Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
