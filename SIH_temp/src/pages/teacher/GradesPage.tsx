import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoTrophyOutline,
  IoAddOutline,
  IoSearchOutline,
  IoPencilOutline,
  IoSaveOutline,
  IoCloseOutline
} from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useAuth } from '../../hooks/useAuth'

export default function GradesPage() {
  const { dbUser, isLoaded } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingGrade, setEditingGrade] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  
  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    assignment_name: '',
    grade: '',
    max_grade: 100,
    semester: '',
    remarks: ''
  })

  // Fetch data
  const courses = useQuery(
    api.courses.getCoursesByTeacher, 
    dbUser?._id ? { teacherId: dbUser._id } : "skip"
  )
  const students = useQuery(api.people.getPeopleByRole, { role: "student" })
  
  // Mock grades data (in a real app, this would come from backend)
  const [grades, setGrades] = useState([
    {
      _id: '1',
      student_id: 'student1',
      student_name: 'John Doe',
      course_id: 'CS101',
      course_name: 'Introduction to Programming',
      assignment_name: 'Midterm Exam',
      grade: 85,
      max_grade: 100,
      semester: '1',
      remarks: 'Good performance',
      teacher_id: dbUser?._id,
      date_graded: '2024-01-15'
    },
    {
      _id: '2',
      student_id: 'student2',
      student_name: 'Jane Smith',
      course_id: 'CS101',
      course_name: 'Introduction to Programming',
      assignment_name: 'Midterm Exam',
      grade: 92,
      max_grade: 100,
      semester: '1',
      remarks: 'Excellent work',
      teacher_id: dbUser?._id,
      date_graded: '2024-01-15'
    },
    {
      _id: '3',
      student_id: 'student1',
      student_name: 'John Doe',
      course_id: 'CS102',
      course_name: 'Data Structures',
      assignment_name: 'Assignment 1',
      grade: 78,
      max_grade: 100,
      semester: '1',
      remarks: 'Needs improvement',
      teacher_id: dbUser?._id,
      date_graded: '2024-01-20'
    }
  ])

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = filterCourse === 'all' || grade.course_id === filterCourse
    const matchesSemester = filterSemester === 'all' || grade.semester === filterSemester
    return matchesSearch && matchesCourse && matchesSemester
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const student = students?.find(s => s._id === formData.student_id)
      const course = courses?.find(c => c._id === formData.course_id)
      
      if (editingGrade) {
        setGrades(prev => prev.map(grade => 
          grade._id === editingGrade._id 
            ? { 
                ...grade, 
                ...formData, 
                grade: Number(formData.grade),
                max_grade: Number(formData.max_grade),
                student_name: student?.full_name || grade.student_name,
                course_name: course?.course_name || grade.course_name,
                course_id: course?.course_id || grade.course_id
              }
            : grade
        ))
      } else {
        const newGrade = {
          _id: Date.now().toString(),
          ...formData,
          grade: Number(formData.grade),
          max_grade: Number(formData.max_grade),
          student_name: student?.full_name || '',
          course_name: course?.course_name || '',
          course_id: course?.course_id || '',
          teacher_id: dbUser?._id,
          date_graded: new Date().toISOString().split('T')[0]
        }
        setGrades(prev => [...prev, newGrade])
      }
      setShowModal(false)
      setEditingGrade(null)
      setFormData({
        student_id: '',
        course_id: '',
        assignment_name: '',
        grade: '',
        max_grade: 100,
        semester: '',
        remarks: ''
      })
    } catch (error) {
      console.error('Error saving grade:', error)
    }
  }

  const handleEdit = (grade: any) => {
    setEditingGrade(grade)
    setFormData({
      student_id: grade.student_id,
      course_id: grade.course_id,
      assignment_name: grade.assignment_name,
      grade: grade.grade.toString(),
      max_grade: grade.max_grade,
      semester: grade.semester,
      remarks: grade.remarks
    })
    setShowModal(true)
  }

  const handleDelete = async (gradeId: string) => {
    if (confirm('Are you sure you want to delete this grade?')) {
      setGrades(prev => prev.filter(grade => grade._id !== gradeId))
    }
  }

  const openCreateModal = () => {
    setEditingGrade(null)
    setFormData({
      student_id: '',
      course_id: '',
      assignment_name: '',
      grade: '',
      max_grade: 100,
      semester: '',
      remarks: ''
    })
    setShowModal(true)
  }

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return 'text-green-600 bg-green-100'
    if (percentage >= 80) return 'text-blue-600 bg-blue-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    if (percentage >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getGradeLetter = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']

  if (!isLoaded || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading grades...</p>
        </div>
      </div>
    )
  }

  if (!courses || !students) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading grades...</p>
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
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">Grade Management</h1>
          <p className="text-gray-600 text-lg">Manage student grades and evaluations</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={openCreateModal}
            className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
          >
            <IoAddOutline className="w-4 h-4" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-5 h-5" />}
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course._id} value={course.course_id}>{course.course_name}</option>
                ))}
              </select>
              
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoTrophyOutline className="w-5 h-5 text-yellow-600" />
            Student Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">Course</th>
                  <th className="text-left p-4">Assignment</th>
                  <th className="text-left p-4">Grade</th>
                  <th className="text-left p-4">Letter</th>
                  <th className="text-left p-4">Semester</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredGrades.map((grade, index) => (
                    <motion.tr
                      key={grade._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold text-sm">
                            {grade.student_name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{grade.student_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{grade.course_name}</p>
                          <p className="text-sm text-gray-600">{grade.course_id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{grade.assignment_name}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade.grade, grade.max_grade)}`}>
                          {grade.grade}/{grade.max_grade}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.grade, grade.max_grade)}`}>
                          {getGradeLetter(grade.grade, grade.max_grade)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          Sem {grade.semester}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">{new Date(grade.date_graded).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(grade)}
                            className="hover:bg-yellow-50 hover:border-yellow-200"
                          >
                            <IoPencilOutline className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(grade._id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <IoCloseOutline className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredGrades.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
          <IoTrophyOutline className="w-12 h-12 text-yellow-600" />
        </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600">Try adjusting your search or add new grades.</p>
        </motion.div>
      )}

      {/* Grade Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingGrade ? "Edit Grade" : "Add New Grade"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student
                  </label>
                  <select
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>{student.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.course_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Name
                  </label>
                  <Input
                    value={formData.assignment_name}
                    onChange={(e) => setFormData({...formData, assignment_name: e.target.value})}
                    placeholder="e.g., Midterm Exam"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <Input
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    placeholder="85"
                    min="0"
                    max={formData.max_grade}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Grade
                  </label>
                  <Input
                    type="number"
                    value={formData.max_grade}
                    onChange={(e) => setFormData({...formData, max_grade: Number(e.target.value)})}
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional comments..."
                />
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
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <IoSaveOutline className="w-4 h-4 mr-2" />
              {editingGrade ? 'Update Grade' : 'Add Grade'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </motion.div>
  )
}
