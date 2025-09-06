import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoSchoolOutline,
  IoBookOutline,
  IoTrophyOutline,
  IoClipboardOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoNotificationsOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoAlarmOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ModalBody, ModalFooter } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { getTodaySchedule, type ScheduleClass } from '../../services/scheduleService'

// Student-specific mock data
const studentStatsData = [
  {
    title: 'My Courses',
    value: '8',
    subtitle: 'Currently Enrolled',
    icon: IoSchoolOutline,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    path: '/my-courses'
  },
  {
    title: 'Overall GPA',
    value: '3.7',
    subtitle: 'Current Semester',
    icon: IoTrophyOutline,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    path: '/my-grades'
  },
  {
    title: 'Assignments',
    value: '12',
    subtitle: 'Due This Week',
    icon: IoClipboardOutline,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    path: '/my-assignments'
  },
  {
    title: 'Attendance',
    value: '92%',
    subtitle: 'This Semester',
    icon: IoCheckmarkCircleOutline,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    path: '/attendance'
  }
]

// Get today's classes dynamically
const getUpcomingClasses = () => {
  const todaySchedule = getTodaySchedule()
  return todaySchedule.classes.map(classItem => ({
    id: classItem.id,
    time: classItem.time.split(' - ')[0], // Extract start time
    subject: classItem.subject,
    instructor: classItem.instructor,
    room: classItem.room,
    status: classItem.status === 'upcoming' ? 'upcoming' : 
            classItem.status === 'ongoing' ? 'next' : 'upcoming',
    duration: classItem.duration || '1h 30m'
  }))
}

const upcomingClasses = getUpcomingClasses()

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



export default function StudentDashboard() {
  const { dbUser } = useAuth()
  const navigate = useNavigate()
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleData, setScheduleData] = useState<ScheduleClass[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)


  const handleCardClick = (path: string) => {
    navigate(path)
  }

  const toggleActivities = () => {
    setShowAllActivities(!showAllActivities)
  }

  const fetchTodaySchedule = async () => {
    console.log('=== SCHEDULE BUTTON CLICKED ===')
    setScheduleLoading(true)
    setScheduleError(null)
    
    try {
      // Use the real schedule service instead of API call
      const todaySchedule = getTodaySchedule()
      console.log('Today\'s schedule:', todaySchedule)
      
      setScheduleData(todaySchedule.classes)
      setShowScheduleModal(true)
    } catch (error) {
      console.error('Error loading schedule:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setScheduleError(`Failed to load schedule: ${errorMessage}`)
      setShowScheduleModal(true)
    } finally {
      setScheduleLoading(false)
    }
  }

  // Show only first 3 activities by default, all if expanded
  const displayedActivities = showAllActivities 
    ? recentStudentActivities 
    : recentStudentActivities.slice(0, 3)

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
            Welcome back, {dbUser?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg break-words truncate overflow-hidden">
            Here's your institution's comprehensive overview and management tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="shadow-md hover:shadow-lg"
            onClick={fetchTodaySchedule}
            disabled={scheduleLoading}
          >
            <IoCalendarOutline className="w-5 h-5 mr-2" />
            {scheduleLoading ? 'Loading...' : 'My Schedule'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 overflow-x-auto">
        {studentStatsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[200px]"
          >
            <Card 
              className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full cursor-pointer hover:scale-105 active:scale-95"
              onClick={() => handleCardClick(stat.path)}
            >
              <div className={`h-2 ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="space-y-8">
        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
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
        </motion.div>

        {/* Assignments Due Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
                  transition={{ delay: 0.7 + index * 0.1 }}
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

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-green-500 rounded-lg">
                  <IoTimeOutline className="w-5 h-5 text-white" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {displayedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-3 rounded-lg ${getActivityStatusColor(activity.status)}`}>
                    <activity.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-base mb-1">{activity.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 font-medium">{activity.course}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {recentStudentActivities.length > 3 && (
                <div className="pt-3 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={toggleActivities}
                  >
                    {showAllActivities ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Today's Schedule"
        size="lg"
      >
        <ModalBody>
          {scheduleError ? (
            <div className="text-center py-8">
              <IoWarningOutline className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{scheduleError}</p>
              <Button 
                variant="outline" 
                onClick={fetchTodaySchedule}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : scheduleData.length === 0 ? (
            <div className="text-center py-8">
              <IoCalendarOutline className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No classes scheduled for today</p>
              <p className="text-gray-500 text-sm mt-2">Enjoy your free day!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduleData.map((lecture, index) => (
                <motion.div
                  key={lecture.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-gray-900 text-lg">
                          {lecture.time}
                        </p>
                        <p className="text-xs text-gray-600">
                          {lecture.duration || ''}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {lecture.subject}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="truncate">
                            👨‍🏫 {lecture.instructor}
                          </span>
                          <span className="truncate">
                            📍 {lecture.room}
                          </span>
                          <span className="truncate">
                            📚 {lecture.type}
                          </span>
                        </div>
                        {lecture.description && (
                          <p className="text-sm text-gray-500 mt-2">
                            {lecture.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lecture.status === 'ongoing' && (
                        <div className="flex items-center gap-1 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
                          <IoAlarmOutline className="w-4 h-4" />
                          Ongoing
                        </div>
                      )}
                      {lecture.status === 'upcoming' && (
                        <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                          <IoAlarmOutline className="w-4 h-4" />
                          Upcoming
                        </div>
                      )}
                      {lecture.status === 'completed' && (
                        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                          <IoCheckmarkCircleOutline className="w-4 h-4" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowScheduleModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  )
}
