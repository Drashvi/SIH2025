import { motion } from 'framer-motion'
import { 
  IoClipboardOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoTimeOutline,
  IoCalendarOutline,
  IoBookOutline,
  IoPersonOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui'

// Mock data for attendance
const attendanceData = [
  {
    course: 'Data Structures',
    instructor: 'Dr. Smith',
    totalClasses: 30,
    attended: 28,
    absent: 2,
    percentage: 93.3,
    trend: 'up'
  },
  {
    course: 'Database Systems',
    instructor: 'Prof. Johnson',
    totalClasses: 25,
    attended: 24,
    absent: 1,
    percentage: 96.0,
    trend: 'up'
  },
  {
    course: 'Software Engineering',
    instructor: 'Dr. Williams',
    totalClasses: 28,
    attended: 25,
    absent: 3,
    percentage: 89.3,
    trend: 'down'
  },
  {
    course: 'Mathematics',
    instructor: 'Dr. Brown',
    totalClasses: 32,
    attended: 30,
    absent: 2,
    percentage: 93.8,
    trend: 'up'
  }
]

const recentAttendance = [
  {
    id: 1,
    date: '2024-01-15',
    course: 'Data Structures',
    instructor: 'Dr. Smith',
    status: 'Present',
    time: '9:00 AM - 10:30 AM',
    room: 'Room 301'
  },
  {
    id: 2,
    date: '2024-01-15',
    course: 'Software Engineering',
    instructor: 'Dr. Williams',
    status: 'Present',
    time: '2:00 PM - 3:30 PM',
    room: 'Room 108'
  },
  {
    id: 3,
    date: '2024-01-14',
    course: 'Database Systems',
    instructor: 'Prof. Johnson',
    status: 'Absent',
    time: '11:00 AM - 12:30 PM',
    room: 'Lab 205'
  },
  {
    id: 4,
    date: '2024-01-14',
    course: 'Mathematics',
    instructor: 'Dr. Brown',
    status: 'Present',
    time: '8:00 AM - 9:30 AM',
    room: 'Room 205'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Present':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Absent':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'Late':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Present':
      return IoCheckmarkCircleOutline
    case 'Absent':
      return IoCloseCircleOutline
    case 'Late':
      return IoTimeOutline
    default:
      return IoClipboardOutline
  }
}

const getTrendIcon = (trend: string) => {
  return trend === 'up' ? IoTrendingUpOutline : IoTrendingDownOutline
}

const getTrendColor = (trend: string) => {
  return trend === 'up' ? 'text-green-600' : 'text-red-600'
}

export default function AttendancePage() {
  const overallAttendance = attendanceData.reduce((sum, course) => sum + course.percentage, 0) / attendanceData.length
  const totalClasses = attendanceData.reduce((sum, course) => sum + course.totalClasses, 0)
  const totalAttended = attendanceData.reduce((sum, course) => sum + course.attended, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orange-600">
            Attendance
          </h1>
          <p className="text-gray-600 mt-2">
            Track your class attendance and monitor your academic presence
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoCalendarOutline className="w-5 h-5 mr-2" />
            Monthly Report
          </Button>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            <IoClipboardOutline className="w-5 h-5 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <IoCheckmarkCircleOutline className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{overallAttendance.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoBookOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoPersonOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Classes Attended</p>
                <p className="text-2xl font-bold text-gray-900">{totalAttended}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoTrendingUpOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Absences</p>
                <p className="text-2xl font-bold text-gray-900">{totalClasses - totalAttended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course-wise Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {attendanceData.map((course, index) => {
          const TrendIcon = getTrendIcon(course.trend)
          
          return (
            <motion.div
              key={course.course}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-orange-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.course}</CardTitle>
                      <p className="text-sm text-gray-600">👨‍🏫 {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <TrendIcon className={`w-5 h-5 ${getTrendColor(course.trend)}`} />
                        <span className={`text-2xl font-bold ${getTrendColor(course.trend)}`}>
                          {course.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{course.attended}</p>
                        <p className="text-sm text-gray-600">Attended</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{course.absent}</p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{course.totalClasses}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Progress</span>
                        <span className="font-medium">{course.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            course.percentage >= 90 ? 'bg-green-500' :
                            course.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${course.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoCalendarOutline className="w-5 h-5" />
            Recent Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAttendance.map((record, index) => {
              const StatusIcon = getStatusIcon(record.status)
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(record.status)}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{record.course}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>👨‍🏫 {record.instructor}</span>
                        <span>📅 {new Date(record.date).toLocaleDateString()}</span>
                        <span>🕐 {record.time}</span>
                        <span>📍 {record.room}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
