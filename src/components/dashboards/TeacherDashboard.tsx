import { motion } from 'framer-motion'
import {
  IoBookOutline,
  IoPeopleOutline,
  IoClipboardOutline,
  IoTrophyOutline,
  IoCalendarOutline,
  IoChatboxOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoStatsChartOutline,
  IoAddOutline,
  IoAlarmOutline,
  IoLibraryOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'

// Teacher-specific mock data
const teacherStatsData = [
  {
    title: 'My Classes',
    value: '6',
    subtitle: 'Active Courses',
    icon: IoLibraryOutline,
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700'
  },
  {
    title: 'My Students',
    value: '189',
    subtitle: 'Total Enrolled',
    icon: IoPeopleOutline,
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    title: 'Assignments',
    value: '23',
    subtitle: 'Pending Review',
    icon: IoDocumentTextOutline,
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  {
    title: 'Average Grade',
    value: '85%',
    subtitle: 'Class Performance',
    icon: IoTrophyOutline,
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }
]

const todaysSchedule = [
  {
    id: 1,
    time: '9:00 AM',
    subject: 'Advanced Mathematics',
    room: 'Room 301',
    students: 35,
    type: 'lecture',
    status: 'upcoming'
  },
  {
    id: 2,
    time: '11:00 AM',
    subject: 'Calculus II',
    room: 'Room 205',
    students: 28,
    type: 'tutorial',
    status: 'current'
  },
  {
    id: 3,
    time: '2:00 PM',
    subject: 'Statistics',
    room: 'Room 108',
    students: 42,
    type: 'lecture',
    status: 'upcoming'
  },
  {
    id: 4,
    time: '4:00 PM',
    subject: 'Math Lab',
    room: 'Lab 3',
    students: 20,
    type: 'practical',
    status: 'upcoming'
  }
]

const recentTeacherActivities = [
  {
    id: 1,
    type: 'assignment',
    title: 'New assignment submitted by John Doe',
    course: 'Advanced Mathematics',
    time: '10 minutes ago',
    icon: IoDocumentTextOutline,
    priority: 'medium'
  },
  {
    id: 2,
    type: 'grade',
    title: 'Graded 15 assignments for Calculus II',
    course: 'Calculus II',
    time: '1 hour ago',
    icon: IoTrophyOutline,
    priority: 'low'
  },
  {
    id: 3,
    type: 'attendance',
    title: 'Attendance marked for Statistics class',
    course: 'Statistics',
    time: '2 hours ago',
    icon: IoClipboardOutline,
    priority: 'low'
  },
  {
    id: 4,
    type: 'message',
    title: 'New message from parent regarding Sarah Smith',
    course: 'Parent Communication',
    time: '3 hours ago',
    icon: IoChatboxOutline,
    priority: 'high'
  }
]

const teacherQuickActions = [
  {
    title: 'Take Attendance',
    description: 'Mark today\'s attendance',
    icon: IoClipboardOutline,
    color: 'bg-green-500',
    action: () => console.log('Take attendance')
  },
  {
    title: 'Create Assignment',
    description: 'Add new assignment',
    icon: IoDocumentTextOutline,
    color: 'bg-blue-500',
    action: () => console.log('Create assignment')
  },
  {
    title: 'Grade Submissions',
    description: 'Review student work',
    icon: IoTrophyOutline,
    color: 'bg-purple-500',
    action: () => console.log('Grade submissions')
  },
  {
    title: 'Send Message',
    description: 'Contact students/parents',
    icon: IoChatboxOutline,
    color: 'bg-indigo-500',
    action: () => console.log('Send message')
  },
  {
    title: 'Class Materials',
    description: 'Upload resources',
    icon: IoLibraryOutline,
    color: 'bg-teal-500',
    action: () => console.log('Upload materials')
  }
]

export default function TeacherDashboard() {
  const { dbUser } = useAuth()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'border-l-4 border-green-500 bg-green-50'
      case 'upcoming':
        return 'border-l-4 border-blue-500 bg-blue-50'
      default:
        return 'border-l-4 border-gray-300 bg-gray-50'
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
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent break-words truncate overflow-hidden">
            Good morning, Prof. {dbUser?.full_name?.split(' ')[0] || 'Teacher'}! 👩‍🏫
          </h1>
          <p className="text-gray-600 mt-2 text-lg break-words truncate overflow-hidden">
            Ready to inspire minds today? Here's your teaching dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg">
            <IoCalendarOutline className="w-5 h-5 mr-2" />
            My Schedule
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg hover:shadow-xl">
            <IoAddOutline className="w-5 h-5 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStatsData.map((stat, index) => (
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
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider truncate">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 truncate">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1 truncate">{stat.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <IoCalendarOutline className="w-6 h-6 text-white" />
                </div>
                Today's Schedule
                <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {todaysSchedule.map((class_, index) => (
                <motion.div
                  key={class_.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-xl ${getStatusColor(class_.status)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="font-bold text-gray-900">{class_.time}</p>
                        <p className="text-xs text-gray-600 capitalize">{class_.type}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{class_.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>📍 {class_.room}</span>
                          <span>👥 {class_.students} students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {class_.status === 'current' ? (
                        <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                          <IoAlarmOutline className="w-4 h-4" />
                          Now
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          <IoBookOutline className="w-4 h-4 mr-1" />
                          Prepare
                        </Button>
                      )}
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
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <IoStatsChartOutline className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {teacherQuickActions.map((action, index) => (
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
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <IoTimeOutline className="w-5 h-5 text-white" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {recentTeacherActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.priority === 'high' ? 'bg-red-100 text-red-600' :
                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
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
