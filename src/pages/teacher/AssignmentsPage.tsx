import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoDocumentTextOutline,
  IoAddOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoTrophyOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoDocumentOutline,
  IoAttachOutline
} from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalBody, ModalFooter, Table } from '../../components/ui'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { useAuth } from '../../hooks/useAuth'

export default function AssignmentsPage() {
  const { dbUser, isLoaded } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
    due_time: '',
    max_points: 100,
    assignment_type: 'homework',
    instructions: '',
    attachments: []
  })

  // Fetch data
  const courses = useQuery(
    api.courses.getCoursesByTeacher, 
    dbUser?._id ? { teacherId: dbUser._id } : "skip"
  )
  const students = useQuery(api.people.getPeopleByRole, { role: "student" })
  
  // Mock assignment data (in a real app, this would come from backend)
  const [assignments, setAssignments] = useState([
    {
      _id: '1',
      course_id: 'CS101',
      title: 'Programming Assignment 1',
      description: 'Create a simple calculator program using Python',
      due_date: '2024-01-15',
      due_time: '23:59',
      max_points: 100,
      assignment_type: 'homework',
      instructions: 'Submit your Python file with proper comments',
      teacher_id: dbUser?._id,
      created_at: '2024-01-01',
      submissions: 15,
      graded: 12
    },
    {
      _id: '2',
      course_id: 'CS102',
      title: 'Data Structures Quiz',
      description: 'Online quiz covering arrays, linked lists, and stacks',
      due_date: '2024-01-20',
      due_time: '14:00',
      max_points: 50,
      assignment_type: 'quiz',
      instructions: 'Complete the quiz within 30 minutes',
      teacher_id: dbUser?._id,
      created_at: '2024-01-05',
      submissions: 22,
      graded: 22
    },
    {
      _id: '3',
      course_id: 'CS103',
      title: 'Algorithm Analysis Project',
      description: 'Analyze time complexity of sorting algorithms',
      due_date: '2024-01-25',
      due_time: '17:00',
      max_points: 150,
      assignment_type: 'project',
      instructions: 'Submit a detailed report with code examples',
      teacher_id: dbUser?._id,
      created_at: '2024-01-10',
      submissions: 8,
      graded: 3
    }
  ])

  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.assignment_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAssignment) {
        setAssignments(prev => prev.map(assignment => 
          assignment._id === editingAssignment._id 
            ? { ...assignment, ...formData, max_points: Number(formData.max_points) }
            : assignment
        ))
      } else {
        const newAssignment = {
          _id: Date.now().toString(),
          ...formData,
          max_points: Number(formData.max_points),
          teacher_id: dbUser?._id,
          created_at: new Date().toISOString().split('T')[0],
          submissions: 0,
          graded: 0
        }
        setAssignments(prev => [...prev, newAssignment])
      }
      setShowModal(false)
      setEditingAssignment(null)
      setFormData({
        course_id: '',
        title: '',
        description: '',
        due_date: '',
        due_time: '',
        max_points: 100,
        assignment_type: 'homework',
        instructions: '',
        attachments: []
      })
    } catch (error) {
      console.error('Error saving assignment:', error)
    }
  }

  const handleEdit = (assignment: any) => {
    setEditingAssignment(assignment)
    setFormData({
      course_id: assignment.course_id,
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      due_time: assignment.due_time,
      max_points: assignment.max_points,
      assignment_type: assignment.assignment_type,
      instructions: assignment.instructions,
      attachments: assignment.attachments || []
    })
    setShowModal(true)
  }

  const handleDelete = async (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(assignment => assignment._id !== assignmentId))
    }
  }

  const openCreateModal = () => {
    setEditingAssignment(null)
    setFormData({
      course_id: '',
      title: '',
      description: '',
      due_date: '',
      due_time: '',
      max_points: 100,
      assignment_type: 'homework',
      instructions: '',
      attachments: []
    })
    setShowModal(true)
  }

  const openSubmissionsModal = (assignment: any) => {
    setSelectedAssignment(assignment)
    setShowSubmissionsModal(true)
  }

  const getCourseName = (courseId: string) => {
    if (!courses) return courseId
    const course = courses.find(c => c.course_id === courseId)
    return course?.course_name || courseId
  }

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800'
      case 'quiz': return 'bg-green-100 text-green-800'
      case 'project': return 'bg-purple-100 text-purple-800'
      case 'exam': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return <IoDocumentOutline className="w-4 h-4" />
      case 'quiz': return <IoTrophyOutline className="w-4 h-4" />
      case 'project': return <IoBookOutline className="w-4 h-4" />
      case 'exam': return <IoDocumentTextOutline className="w-4 h-4" />
      default: return <IoDocumentOutline className="w-4 h-4" />
    }
  }

  const isOverdue = (dueDate: string, dueTime: string) => {
    const now = new Date()
    const due = new Date(`${dueDate}T${dueTime}`)
    return now > due
  }

  if (!isLoaded || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading assignments...</p>
        </div>
      </div>
    )
  }

  if (!courses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Assignments</h1>
          <p className="text-gray-600 text-lg">Create and manage student assignments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <IoAddOutline className="w-4 h-4" />
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-5 h-5" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <div className={`h-2 ${isOverdue(assignment.due_date, assignment.due_time) ? 'bg-red-500' : 'bg-purple-500'}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">Course: {getCourseName(assignment.course_id)}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <IoCalendarOutline className="w-4 h-4" />
                        <span>{new Date(assignment.due_date).toLocaleDateString()}</span>
                        <span className="mx-1">•</span>
                        <span>{assignment.due_time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAssignmentTypeColor(assignment.assignment_type)}`}>
                        {getAssignmentTypeIcon(assignment.assignment_type)}
                        {assignment.assignment_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoTrophyOutline className="w-4 h-4 text-purple-500" />
                      <span>{assignment.max_points} points</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoPeopleOutline className="w-4 h-4 text-purple-500" />
                      <span>{assignment.submissions} submissions</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openSubmissionsModal(assignment)}
                      className="flex-1 hover:bg-purple-50 hover:border-purple-200"
                    >
                      <IoEyeOutline className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(assignment)}
                      className="hover:bg-purple-50 hover:border-purple-200"
                    >
                      <IoPencilOutline className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(assignment._id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <IoTrashOutline className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAssignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <IoDocumentTextOutline className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">Try adjusting your search or create a new assignment.</p>
        </motion.div>
      )}

      {/* Assignment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAssignment ? "Edit Assignment" : "Create New Assignment"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course.course_id}>{course.course_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type
                  </label>
                  <select
                    value={formData.assignment_type}
                    onChange={(e) => setFormData({...formData, assignment_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="homework">Homework</option>
                    <option value="quiz">Quiz</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Programming Assignment 1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the assignment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="Detailed instructions for students"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Time
                  </label>
                  <Input
                    type="time"
                    value={formData.due_time}
                    onChange={(e) => setFormData({...formData, due_time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Points
                  </label>
                  <Input
                    type="number"
                    value={formData.max_points}
                    onChange={(e) => setFormData({...formData, max_points: Number(e.target.value)})}
                    min="1"
                    max="1000"
                    required
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Submissions Modal */}
      <Modal
        isOpen={showSubmissionsModal}
        onClose={() => setShowSubmissionsModal(false)}
        title={`Submissions for ${selectedAssignment?.title}`}
        size="lg"
      >
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">{selectedAssignment?.title}</h4>
                <p className="text-sm text-gray-600">Due: {selectedAssignment?.due_date} at {selectedAssignment?.due_time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Submissions</p>
                <p className="text-2xl font-bold text-purple-600">{selectedAssignment?.submissions}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Student Submissions</h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {students?.slice(0, selectedAssignment?.submissions || 0).map((student, index) => (
                  <div key={student._id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                      {student.full_name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.full_name}</p>
                      <p className="text-sm text-gray-600">{student.er_no}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="text-xs text-green-600">2 days ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Grade
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowSubmissionsModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  )
}
