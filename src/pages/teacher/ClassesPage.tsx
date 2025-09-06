import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoLibraryOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoLocationOutline,
  IoBookOutline,
  IoAddOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoStatsChartOutline
} from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalBody, ModalFooter, Table } from '../../components/ui'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { useAuth } from '../../hooks/useAuth'

export default function ClassesPage() {
  const { dbUser, isLoaded } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    course_id: '',
    class_name: '',
    room: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    max_students: 30
  })

  // Fetch data
  const courses = useQuery(
    api.courses.getCoursesByTeacher, 
    dbUser?._id ? { teacherId: dbUser._id } : "skip"
  )
  const students = useQuery(api.people.getPeopleByRole, { role: "student" })
  
  // Mock class data (in a real app, this would come from backend)
  const [classes, setClasses] = useState([
    {
      _id: '1',
      course_id: 'CS101',
      class_name: 'Introduction to Programming',
      room: 'A101',
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '10:30',
      max_students: 30,
      enrolled_students: 25,
      teacher_id: dbUser?._id
    },
    {
      _id: '2',
      course_id: 'CS102',
      class_name: 'Data Structures',
      room: 'A102',
      day_of_week: 'Wednesday',
      start_time: '11:00',
      end_time: '12:30',
      max_students: 25,
      enrolled_students: 22,
      teacher_id: dbUser?._id
    },
    {
      _id: '3',
      course_id: 'CS103',
      class_name: 'Algorithms',
      room: 'A103',
      day_of_week: 'Friday',
      start_time: '14:00',
      end_time: '15:30',
      max_students: 20,
      enrolled_students: 18,
      teacher_id: dbUser?._id
    }
  ])

  const filteredClasses = classes.filter(cls => 
    cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.room.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingClass) {
        setClasses(prev => prev.map(cls => 
          cls._id === editingClass._id 
            ? { ...cls, ...formData, max_students: Number(formData.max_students) }
            : cls
        ))
      } else {
        const newClass = {
          _id: Date.now().toString(),
          ...formData,
          max_students: Number(formData.max_students),
          enrolled_students: 0,
          teacher_id: dbUser?._id
        }
        setClasses(prev => [...prev, newClass])
      }
      setShowModal(false)
      setEditingClass(null)
      setFormData({
        course_id: '',
        class_name: '',
        room: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        max_students: 30
      })
    } catch (error) {
      console.error('Error saving class:', error)
    }
  }

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem)
    setFormData({
      course_id: classItem.course_id,
      class_name: classItem.class_name,
      room: classItem.room,
      day_of_week: classItem.day_of_week,
      start_time: classItem.start_time,
      end_time: classItem.end_time,
      max_students: classItem.max_students
    })
    setShowModal(true)
  }

  const handleDelete = async (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls._id !== classId))
    }
  }

  const openCreateModal = () => {
    setEditingClass(null)
    setFormData({
      course_id: '',
      class_name: '',
      room: '',
      day_of_week: '',
      start_time: '',
      end_time: '',
      max_students: 30
    })
    setShowModal(true)
  }

  const openStudentsModal = (classItem: any) => {
    setSelectedClass(classItem)
    setShowStudentsModal(true)
  }

  const getCourseName = (courseId: string) => {
    if (!courses) return courseId
    const course = courses.find(c => c.course_id === courseId)
    return course?.course_name || courseId
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (!isLoaded || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading classes...</p>
        </div>
      </div>
    )
  }

  if (!courses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading classes...</p>
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
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">My Classes</h1>
          <p className="text-gray-600 text-lg">Manage your teaching classes and schedules</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
          >
            <IoAddOutline className="w-4 h-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-5 h-5" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredClasses.map((classItem, index) => (
            <motion.div
              key={classItem._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <div className="h-2 bg-emerald-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{classItem.class_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Course: {classItem.course_id}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoCalendarOutline className="w-4 h-4" />
                        <span>{classItem.day_of_week}</span>
                        <span className="mx-1">•</span>
                        <span>{classItem.start_time} - {classItem.end_time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoLocationOutline className="w-4 h-4 text-emerald-500" />
                      <span>Room {classItem.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoPeopleOutline className="w-4 h-4 text-emerald-500" />
                      <span>{classItem.enrolled_students}/{classItem.max_students} students</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openStudentsModal(classItem)}
                      className="flex-1 hover:bg-emerald-50 hover:border-emerald-200"
                    >
                      <IoEyeOutline className="w-4 h-4 mr-1" />
                      Students
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(classItem)}
                      className="hover:bg-emerald-50 hover:border-emerald-200"
                    >
                      <IoPencilOutline className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(classItem._id)}
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

      {filteredClasses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
            <IoLibraryOutline className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600">Try adjusting your search or create a new class.</p>
        </motion.div>
      )}

      {/* Class Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClass ? "Edit Class" : "Add New Class"}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    Class Name
                  </label>
                  <Input
                    value={formData.class_name}
                    onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                    placeholder="e.g., Programming Lab"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    placeholder="e.g., A101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <Input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({...formData, max_students: Number(e.target.value)})}
                    min="1"
                    max="100"
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {editingClass ? 'Update Class' : 'Create Class'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title={`Students in ${selectedClass?.class_name}`}
        size="lg"
      >
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">{selectedClass?.class_name}</h4>
                <p className="text-sm text-gray-600">Room {selectedClass?.room} • {selectedClass?.day_of_week} {selectedClass?.start_time}-{selectedClass?.end_time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Enrolled</p>
                <p className="text-2xl font-bold text-emerald-600">{selectedClass?.enrolled_students}/{selectedClass?.max_students}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Student List</h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {students?.slice(0, selectedClass?.enrolled_students || 0).map((student, index) => (
                  <div key={student._id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">
                      {student.full_name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.full_name}</p>
                      <p className="text-sm text-gray-600">{student.er_no}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Sem {student.semester}</p>
                    </div>
                  </div>
                ))}
              </div>
        </div>
      </div>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowStudentsModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  )
}
