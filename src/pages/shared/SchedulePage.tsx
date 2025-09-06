import { motion } from 'framer-motion'
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoLocationOutline, 
  IoPersonOutline,
  IoBookOutline,
  IoTodayOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui'

// Mock data for schedule
const weeklySchedule = [
  {
    day: 'Monday',
    date: '2024-01-15',
    classes: [
      {
        id: 1,
        time: '9:00 AM - 10:30 AM',
        subject: 'Data Structures',
        instructor: 'Dr. Smith',
        room: 'Room 301',
        type: 'Lecture',
        color: 'bg-blue-500'
      },
      {
        id: 2,
        time: '2:00 PM - 3:30 PM',
        subject: 'Software Engineering',
        instructor: 'Dr. Williams',
        room: 'Room 108',
        type: 'Lecture',
        color: 'bg-green-500'
      }
    ]
  },
  {
    day: 'Tuesday',
    date: '2024-01-16',
    classes: [
      {
        id: 3,
        time: '8:00 AM - 9:30 AM',
        subject: 'Mathematics',
        instructor: 'Dr. Brown',
        room: 'Room 205',
        type: 'Lecture',
        color: 'bg-purple-500'
      },
      {
        id: 4,
        time: '11:00 AM - 12:30 PM',
        subject: 'Database Systems',
        instructor: 'Prof. Johnson',
        room: 'Lab 205',
        type: 'Lab',
        color: 'bg-orange-500'
      }
    ]
  },
  {
    day: 'Wednesday',
    date: '2024-01-17',
    classes: [
      {
        id: 5,
        time: '9:00 AM - 10:30 AM',
        subject: 'Data Structures',
        instructor: 'Dr. Smith',
        room: 'Room 301',
        type: 'Lecture',
        color: 'bg-blue-500'
      },
      {
        id: 6,
        time: '2:00 PM - 3:30 PM',
        subject: 'Software Engineering',
        instructor: 'Dr. Williams',
        room: 'Room 108',
        type: 'Lecture',
        color: 'bg-green-500'
      }
    ]
  },
  {
    day: 'Thursday',
    date: '2024-01-18',
    classes: [
      {
        id: 7,
        time: '8:00 AM - 9:30 AM',
        subject: 'Mathematics',
        instructor: 'Dr. Brown',
        room: 'Room 205',
        type: 'Lecture',
        color: 'bg-purple-500'
      },
      {
        id: 8,
        time: '11:00 AM - 12:30 PM',
        subject: 'Database Systems',
        instructor: 'Prof. Johnson',
        room: 'Lab 205',
        type: 'Lab',
        color: 'bg-orange-500'
      }
    ]
  },
  {
    day: 'Friday',
    date: '2024-01-19',
    classes: [
      {
        id: 9,
        time: '9:00 AM - 10:30 AM',
        subject: 'Data Structures',
        instructor: 'Dr. Smith',
        room: 'Room 301',
        type: 'Lecture',
        color: 'bg-blue-500'
      }
    ]
  }
]

const todayClasses = [
  {
    id: 1,
    time: '9:00 AM - 10:30 AM',
    subject: 'Data Structures',
    instructor: 'Dr. Smith',
    room: 'Room 301',
    type: 'Lecture',
    status: 'upcoming'
  },
  {
    id: 2,
    time: '2:00 PM - 3:30 PM',
    subject: 'Software Engineering',
    instructor: 'Dr. Williams',
    room: 'Room 108',
    type: 'Lecture',
    status: 'upcoming'
  }
]

export default function SchedulePage() {
  const currentDate = new Date()
  const today = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

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
          <h1 className="text-3xl font-bold text-red-600">
            My Schedule
          </h1>
          <p className="text-gray-600 mt-2">
            View your academic timetable and class schedule
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoChevronBackOutline className="w-5 h-5 mr-2" />
            Previous Week
          </Button>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            <IoChevronForwardOutline className="w-5 h-5 mr-2" />
            Next Week
          </Button>
        </div>
      </div>

      {/* Today's Classes */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <IoTodayOutline className="w-5 h-5 text-white" />
            </div>
            Today's Classes - {today}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((class_, index) => (
                <motion.div
                  key={class_.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[100px]">
                      <p className="font-bold text-gray-900">{class_.time}</p>
                      <p className="text-xs text-gray-600">{class_.type}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{class_.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <IoPersonOutline className="w-4 h-4" />
                          {class_.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <IoLocationOutline className="w-4 h-4" />
                          {class_.room}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {class_.status}
                    </span>
                    <Button size="sm" variant="outline">
                      Join Class
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IoCalendarOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No classes scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {weeklySchedule.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-center">
                  <div className="text-lg font-bold text-gray-900">{day.day}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {day.classes.length > 0 ? (
                  <div className="space-y-3">
                    {day.classes.map((class_, classIndex) => (
                      <motion.div
                        key={class_.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (dayIndex * 0.1) + (classIndex * 0.05) }}
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${class_.color}`}></div>
                          <span className="text-xs font-medium text-gray-600">{class_.type}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{class_.subject}</h4>
                        <p className="text-xs text-gray-600 mb-1">{class_.time}</p>
                        <p className="text-xs text-gray-500">{class_.instructor}</p>
                        <p className="text-xs text-gray-500">{class_.room}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IoCalendarOutline className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No classes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoBookOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklySchedule.reduce((sum, day) => sum + day.classes.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoTimeOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">{todayClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoPersonOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <IoLocationOutline className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
