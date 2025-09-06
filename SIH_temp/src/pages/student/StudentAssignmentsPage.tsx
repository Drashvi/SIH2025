import { motion } from 'framer-motion'
import { 
  IoDocumentTextOutline, 
  IoTimeOutline, 
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoCalendarOutline
} from 'react-icons/io5'
import { Card, CardContent, Button } from '../../components/ui'

// Mock data for assignments
const assignments = [
  {
    id: 1,
    title: 'Data Structures Project',
    course: 'Data Structures',
    instructor: 'Dr. Smith',
    dueDate: '2024-01-15',
    status: 'pending',
    priority: 'high',
    description: 'Implement a binary search tree with insertion, deletion, and traversal operations.',
    progress: 60,
    points: 100
  },
  {
    id: 2,
    title: 'Database Design Report',
    course: 'Database Systems',
    instructor: 'Prof. Johnson',
    dueDate: '2024-01-20',
    status: 'submitted',
    priority: 'medium',
    description: 'Design a normalized database schema for an e-commerce platform.',
    progress: 100,
    points: 85
  },
  {
    id: 3,
    title: 'Software Requirements Document',
    course: 'Software Engineering',
    instructor: 'Dr. Williams',
    dueDate: '2024-01-25',
    status: 'pending',
    priority: 'low',
    description: 'Create a comprehensive SRS document for a library management system.',
    progress: 30,
    points: 75
  },
  {
    id: 4,
    title: 'Algorithm Analysis',
    course: 'Data Structures',
    instructor: 'Dr. Smith',
    dueDate: '2024-01-18',
    status: 'overdue',
    priority: 'high',
    description: 'Analyze the time complexity of various sorting algorithms.',
    progress: 45,
    points: 50
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'submitted':
      return IoCheckmarkCircleOutline
    case 'pending':
      return IoTimeOutline
    case 'overdue':
      return IoWarningOutline
    default:
      return IoDocumentTextOutline
  }
}

export default function StudentAssignmentsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDaysUntilDue = (dateString: string) => {
    const dueDate = new Date(dateString)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

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
            My Assignments
          </h1>
          <p className="text-gray-600 mt-2">
            Track your assignments, deadlines, and submission status
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoCalendarOutline className="w-5 h-5 mr-2" />
            Calendar View
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <IoDocumentTextOutline className="w-5 h-5 mr-2" />
            Submit Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoDocumentTextOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'submitted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <IoTimeOutline className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <IoWarningOutline className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'overdue').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {assignments.map((assignment, index) => {
          const StatusIcon = getStatusIcon(assignment.status)
          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
          
          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(assignment.status)}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(assignment.priority)}`}></div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{assignment.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>📚 {assignment.course}</span>
                            <span>👨‍🏫 {assignment.instructor}</span>
                            <span>📅 Due: {formatDate(assignment.dueDate)}</span>
                            <span>⭐ {assignment.points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Progress</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getPriorityColor(assignment.priority)}`}
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{assignment.progress}%</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {assignment.status === 'pending' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Continue Work
                          </Button>
                        )}
                        {assignment.status === 'overdue' && (
                          <Button size="sm" variant="danger">
                            Submit Now
                          </Button>
                        )}
                        {assignment.status === 'submitted' && (
                          <Button size="sm" variant="outline">
                            View Feedback
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {daysUntilDue <= 3 && assignment.status !== 'submitted' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <IoWarningOutline className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {daysUntilDue <= 0 
                            ? 'This assignment is overdue!' 
                            : `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
