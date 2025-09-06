import { motion } from 'framer-motion'
import { 
  IoTrophyOutline, 
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoBookOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui'

// Mock data for grades
const courses = [
  {
    id: 1,
    name: 'Data Structures',
    instructor: 'Dr. Smith',
    credits: 4,
    currentGrade: 'A-',
    gpa: 3.7,
    assignments: [
      { name: 'Binary Tree Implementation', grade: 95, maxPoints: 100, weight: 25 },
      { name: 'Sorting Algorithms', grade: 88, maxPoints: 100, weight: 25 },
      { name: 'Final Project', grade: 92, maxPoints: 100, weight: 50 }
    ],
    trend: 'up'
  },
  {
    id: 2,
    name: 'Database Systems',
    instructor: 'Prof. Johnson',
    credits: 3,
    currentGrade: 'B+',
    gpa: 3.3,
    assignments: [
      { name: 'ER Diagram Design', grade: 85, maxPoints: 100, weight: 30 },
      { name: 'SQL Queries', grade: 78, maxPoints: 100, weight: 30 },
      { name: 'Database Project', grade: 90, maxPoints: 100, weight: 40 }
    ],
    trend: 'up'
  },
  {
    id: 3,
    name: 'Software Engineering',
    instructor: 'Dr. Williams',
    credits: 3,
    currentGrade: 'A',
    gpa: 4.0,
    assignments: [
      { name: 'Requirements Analysis', grade: 95, maxPoints: 100, weight: 20 },
      { name: 'System Design', grade: 92, maxPoints: 100, weight: 30 },
      { name: 'Final Presentation', grade: 98, maxPoints: 100, weight: 50 }
    ],
    trend: 'up'
  },
  {
    id: 4,
    name: 'Mathematics',
    instructor: 'Dr. Brown',
    credits: 4,
    currentGrade: 'B',
    gpa: 3.0,
    assignments: [
      { name: 'Calculus Midterm', grade: 75, maxPoints: 100, weight: 30 },
      { name: 'Linear Algebra', grade: 82, maxPoints: 100, weight: 30 },
      { name: 'Final Exam', grade: 85, maxPoints: 100, weight: 40 }
    ],
    trend: 'down'
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
    case 'D':
      return 'text-orange-600 bg-orange-100'
    case 'F':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getGPAColor = (gpa: number) => {
  if (gpa >= 3.7) return 'text-green-600'
  if (gpa >= 3.0) return 'text-blue-600'
  if (gpa >= 2.0) return 'text-yellow-600'
  return 'text-red-600'
}

const getTrendIcon = (trend: string) => {
  return trend === 'up' ? IoTrendingUpOutline : IoTrendingDownOutline
}

const getTrendColor = (trend: string) => {
  return trend === 'up' ? 'text-green-600' : 'text-red-600'
}

export default function StudentGradesPage() {
  const overallGPA = courses.reduce((sum, course) => sum + course.gpa, 0) / courses.length
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)

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
          <h1 className="text-3xl font-bold text-yellow-600">
            My Grades
          </h1>
          <p className="text-gray-600 mt-2">
            Track your academic performance and progress
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoStatsChartOutline className="w-5 h-5 mr-2" />
            Analytics
          </Button>
          <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
            <IoCalendarOutline className="w-5 h-5 mr-2" />
            Grade History
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <IoTrophyOutline className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                <p className={`text-2xl font-bold ${getGPAColor(overallGPA)}`}>
                  {overallGPA.toFixed(2)}
                </p>
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
                <IoCheckmarkCircleOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoStatsChartOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => {
                    const gradeValue = course.currentGrade === 'A' ? 4.0 : 
                                     course.currentGrade === 'A-' ? 3.7 :
                                     course.currentGrade === 'B+' ? 3.3 :
                                     course.currentGrade === 'B' ? 3.0 : 2.0
                    return sum + gradeValue
                  }, 0) / courses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grades */}
      <div className="space-y-6">
        {courses.map((course, index) => {
          const TrendIcon = getTrendIcon(course.trend)
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <IoBookOutline className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{course.name}</CardTitle>
                        <p className="text-sm text-gray-600">👨‍🏫 {course.instructor} • {course.credits} credits</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(course.currentGrade)}`}>
                          {course.currentGrade}
                        </div>
                        <p className={`text-sm font-medium ${getGPAColor(course.gpa)}`}>
                          GPA: {course.gpa}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${course.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <TrendIcon className={`w-5 h-5 ${getTrendColor(course.trend)}`} />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Assignment Breakdown</h4>
                    <div className="space-y-3">
                      {course.assignments.map((assignment, assignmentIndex) => (
                        <div key={assignmentIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{assignment.name}</p>
                            <p className="text-sm text-gray-600">{assignment.weight}% of total grade</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{assignment.grade}/{assignment.maxPoints}</p>
                            <p className="text-sm text-gray-600">
                              {((assignment.grade / assignment.maxPoints) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Grade Distribution Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoStatsChartOutline className="w-5 h-5" />
            Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <IoStatsChartOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Grade distribution chart will be displayed here</p>
              <p className="text-sm text-gray-500">Visual representation of your academic performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
