import { motion } from 'framer-motion'
import { 
  IoSchoolOutline, 
  IoPersonOutline, 
  IoCalendarOutline, 
  IoTrophyOutline,
  IoBookOutline,
  IoTimeOutline,
  IoStatsChartOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui'

// Mock data for courses
const courses = [
  {
    id: 1,
    name: 'Data Structures and Algorithms',
    code: 'CS-301',
    instructor: 'Dr. Smith',
    credits: 4,
    semester: 'Fall 2024',
    schedule: 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
    room: 'Room 301',
    progress: 75,
    grade: 'A-',
    description: 'Advanced data structures including trees, graphs, and algorithm analysis.',
    assignments: 8,
    completed: 6
  },
  {
    id: 2,
    name: 'Database Systems',
    code: 'CS-302',
    instructor: 'Prof. Johnson',
    credits: 3,
    semester: 'Fall 2024',
    schedule: 'Tue, Thu 11:00 AM - 12:30 PM',
    room: 'Lab 205',
    progress: 60,
    grade: 'B+',
    description: 'Database design, SQL, and database management systems.',
    assignments: 6,
    completed: 4
  },
  {
    id: 3,
    name: 'Software Engineering',
    code: 'CS-303',
    instructor: 'Dr. Williams',
    credits: 3,
    semester: 'Fall 2024',
    schedule: 'Mon, Wed 2:00 PM - 3:30 PM',
    room: 'Room 108',
    progress: 85,
    grade: 'A',
    description: 'Software development lifecycle, project management, and team collaboration.',
    assignments: 5,
    completed: 4
  },
  {
    id: 4,
    name: 'Mathematics for Computer Science',
    code: 'MATH-201',
    instructor: 'Dr. Brown',
    credits: 4,
    semester: 'Fall 2024',
    schedule: 'Tue, Thu 8:00 AM - 9:30 AM',
    room: 'Room 205',
    progress: 50,
    grade: 'B',
    description: 'Discrete mathematics, calculus, and linear algebra for computer science.',
    assignments: 10,
    completed: 5
  }
]

const getGradeColor = (grade: string) => {
  switch (grade.charAt(0)) {
    case 'A':
      return 'text-green-600 bg-green-100'
    case 'B':
      return 'text-blue-600 bg-blue-100'
    case 'C':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export default function MyCoursesPage() {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  const averageProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length

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
          <h1 className="text-3xl font-bold text-blue-600">
            My Courses
          </h1>
          <p className="text-gray-600 mt-2">
            Track your enrolled courses, progress, and academic performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoStatsChartOutline className="w-5 h-5 mr-2" />
            Progress Report
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <IoBookOutline className="w-5 h-5 mr-2" />
            Course Catalog
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <IoSchoolOutline className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoBookOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoStatsChartOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{averageProgress.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoTrophyOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current GPA</p>
                <p className="text-2xl font-bold text-gray-900">3.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 h-full">
              <CardHeader className="bg-blue-50 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{course.name}</CardTitle>
                    <p className="text-sm text-gray-600 font-medium">{course.code}</p>
                    <p className="text-sm text-gray-500">👨‍🏫 {course.instructor}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">{course.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{course.semester}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoTimeOutline className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{course.credits} credits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoPersonOutline className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{course.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoBookOutline className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{course.completed}/{course.assignments} assignments</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Access Materials
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoCalendarOutline className="w-5 h-5" />
            Weekly Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <IoCalendarOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Weekly schedule calendar will be displayed here</p>
              <p className="text-sm text-gray-500">Visual representation of your class timetable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
