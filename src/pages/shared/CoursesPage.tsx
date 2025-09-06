import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoBookOutline,
  IoAddOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoCalendarOutline,
  IoLibraryOutline
} from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalBody, ModalFooter, Table } from '../../components/ui'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export default function CoursesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSemester, setFilterSemester] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  
  // Form state
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    semester: '',
    credits: 0,
    department_id: '' as Id<"departments"> | '',
    teacher_id: '' as Id<"people"> | ''
  })

  // Fetch data
  const courses = useQuery(api.courses.getAllCourses)
  const departments = useQuery(api.departments.getAllDepartments)
  const teachers = useQuery(api.people.getPeopleByRole, { role: "teacher" })
  
  // Mutations
  const createCourse = useMutation(api.courses.createCourse)
  const updateCourse = useMutation(api.courses.updateCourse)
  const deleteCourse = useMutation(api.courses.deleteCourse)

  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester = filterSemester === 'all' || course.semester === filterSemester
    const matchesDepartment = filterDepartment === 'all' || course.department_id === filterDepartment
    return matchesSearch && matchesSemester && matchesDepartment
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCourse) {
        await updateCourse({
          id: editingCourse._id,
          ...formData,
          credits: Number(formData.credits),
          department_id: formData.department_id as Id<"departments">,
          teacher_id: formData.teacher_id as Id<"people">
        })
      } else {
        await createCourse({
          ...formData,
          credits: Number(formData.credits),
          department_id: formData.department_id as Id<"departments">,
          teacher_id: formData.teacher_id as Id<"people">
        })
      }
      setShowModal(false)
      setEditingCourse(null)
      setFormData({
        course_id: '',
        course_name: '',
        semester: '',
        credits: 0,
        department_id: '',
        teacher_id: ''
      })
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleEdit = (course: any) => {
    setEditingCourse(course)
    setFormData({
      course_id: course.course_id,
      course_name: course.course_name,
      semester: course.semester,
      credits: course.credits,
      department_id: course.department_id,
      teacher_id: course.teacher_id
    })
    setShowModal(true)
  }

  const handleDelete = async (courseId: Id<"courses">) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse({ id: courseId })
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingCourse(null)
    setFormData({
      course_id: '',
      course_name: '',
      semester: '',
      credits: 0,
      department_id: '',
      teacher_id: ''
    })
    setShowModal(true)
  }

  const getDepartmentName = (departmentId: Id<"departments">) => {
    if (!departments) return 'N/A'
    const dept = departments.find(d => d._id === departmentId)
    return dept?.department_name || 'N/A'
  }

  const getTeacherName = (teacherId: Id<"people">) => {
    if (!teachers) return 'N/A'
    const teacher = teachers.find(t => t._id === teacherId)
    return teacher?.full_name || 'N/A'
  }

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']

  if (!courses || !departments || !teachers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading courses...</p>
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
          <h1 className="text-4xl font-bold text-teal-600 mb-2">Course Management</h1>
          <p className="text-gray-600 text-lg">Manage course catalog and assignments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={openCreateModal}
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
          >
            <IoAddOutline className="w-4 h-4" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-5 h-5" />}
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.department_name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <div className="h-2 bg-teal-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{course.course_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">ID: {course.course_id}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoCalendarOutline className="w-4 h-4" />
                        <span>Semester {course.semester}</span>
                        <span className="mx-1">•</span>
                        <span>{course.credits} credits</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoSchoolOutline className="w-4 h-4 text-teal-500" />
                      <span>{getDepartmentName(course.department_id)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoPersonOutline className="w-4 h-4 text-teal-500" />
                      <span>{getTeacherName(course.teacher_id)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(course)}
                      className="flex-1 hover:bg-teal-50 hover:border-teal-200"
                    >
                      <IoPencilOutline className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(course._id)}
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

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
          <IoBookOutline className="w-12 h-12 text-teal-600" />
        </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </motion.div>
      )}

      {/* Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course ID
                  </label>
                  <Input
                    value={formData.course_id}
                    onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <Input
                    value={formData.course_name}
                    onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                    placeholder="e.g., Introduction to Programming"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits
                  </label>
                  <Input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: Number(e.target.value)})}
                    placeholder="3"
                    min="1"
                    max="6"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({...formData, department_id: e.target.value as Id<"departments">})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.department_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher
                  </label>
                  <select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({...formData, teacher_id: e.target.value as Id<"people">})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>{teacher.full_name}</option>
                    ))}
                  </select>
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
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </motion.div>
  )
}
