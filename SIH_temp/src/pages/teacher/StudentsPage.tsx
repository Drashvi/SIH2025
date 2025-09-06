import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoPeopleOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoMailOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoPersonOutline,
  IoBookOutline,
  IoTrophyOutline,
  IoStatsChartOutline,
  IoDownloadOutline,
  IoCheckmarkOutline,
  IoLocationOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { Card, CardContent, Button, Input, Modal, ModalBody, ModalFooter, Table } from '../../components/ui'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [filterSemester, setFilterSemester] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Fetch data
  const students = useQuery(api.people.getPeopleByRole, { role: "student" })
  const departments = useQuery(api.departments.getAllDepartments)

  // Mock student data with additional information
  const [studentData] = useState([
    {
      _id: '1',
      full_name: 'John Doe',
      er_no: 'CS2024001',
      email: 'john.doe@university.edu',
      phone: '+1-555-0123',
      semester: '5',
      department_id: 'dept1',
      gender: 'Male',
      micro: 'Machine Learning',
      minor: 'Data Science',
      guardian_contact: '+1-555-0124',
      attendance_percentage: 85,
      average_grade: 78,
      total_assignments: 12,
      completed_assignments: 10,
      last_active: '2024-01-15'
    },
    {
      _id: '2',
      full_name: 'Jane Smith',
      er_no: 'CS2024002',
      email: 'jane.smith@university.edu',
      phone: '+1-555-0125',
      semester: '5',
      department_id: 'dept1',
      gender: 'Female',
      micro: 'Web Development',
      minor: 'UI/UX Design',
      guardian_contact: '+1-555-0126',
      attendance_percentage: 92,
      average_grade: 85,
      total_assignments: 12,
      completed_assignments: 12,
      last_active: '2024-01-16'
    },
    {
      _id: '3',
      full_name: 'Mike Johnson',
      er_no: 'CS2024003',
      email: 'mike.johnson@university.edu',
      phone: '+1-555-0127',
      semester: '3',
      department_id: 'dept1',
      gender: 'Male',
      micro: 'Cybersecurity',
      minor: 'Network Security',
      guardian_contact: '+1-555-0128',
      attendance_percentage: 78,
      average_grade: 72,
      total_assignments: 8,
      completed_assignments: 6,
      last_active: '2024-01-14'
    },
    {
      _id: '4',
      full_name: 'Sarah Wilson',
      er_no: 'CS2024004',
      email: 'sarah.wilson@university.edu',
      phone: '+1-555-0129',
      semester: '7',
      department_id: 'dept1',
      gender: 'Female',
      micro: 'Artificial Intelligence',
      minor: 'Robotics',
      guardian_contact: '+1-555-0130',
      attendance_percentage: 95,
      average_grade: 88,
      total_assignments: 15,
      completed_assignments: 15,
      last_active: '2024-01-16'
    }
  ])

  const filteredStudents = studentData.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.er_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSemester = !filterSemester || student.semester === filterSemester
    const matchesDepartment = !filterDepartment || student.department_id === filterDepartment
    
    return matchesSearch && matchesSemester && matchesDepartment
  })

  const openStudentModal = (student: any) => {
    setSelectedStudent(student)
    setShowStudentModal(true)
  }

  const getDepartmentName = (departmentId: string) => {
    if (!departments) return 'Unknown Department'
    const department = departments.find((d: any) => d._id === departmentId)
    return department?.department_name || 'Unknown Department'
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    if (grade >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSemesters = () => {
    const semesters = [...new Set(studentData.map(student => student.semester))]
    return semesters.sort()
  }

  if (!students || !departments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading students...</p>
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
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Students</h1>
          <p className="text-gray-600 text-lg">View and manage student information</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <IoDownloadOutline className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students by name, enrollment number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Semesters</option>
                {getSemesters().map(semester => (
                  <option key={semester} value={semester}>Semester {semester}</option>
                ))}
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.department_name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
              </div>
              <IoPeopleOutline className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(filteredStudents.reduce((acc, student) => acc + student.average_grade, 0) / filteredStudents.length) || 0}%
                </p>
              </div>
              <IoTrophyOutline className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredStudents.reduce((acc, student) => acc + student.attendance_percentage, 0) / filteredStudents.length) || 0}%
                </p>
              </div>
              <IoStatsChartOutline className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredStudents.filter(s => s.last_active >= '2024-01-15').length}
                </p>
              </div>
              <IoCheckmarkOutline className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer"
                      onClick={() => openStudentModal(student)}>
                  <div className="h-2 bg-blue-500"></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{student.full_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{student.er_no}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <IoSchoolOutline className="w-4 h-4" />
                          <span>Semester {student.semester}</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                        {student.full_name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoBookOutline className="w-4 h-4 text-blue-500" />
                        <span>{student.micro}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoLocationOutline className="w-4 h-4 text-blue-500" />
                        <span>{getDepartmentName(student.department_id)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoTrophyOutline className="w-4 h-4 text-blue-500" />
                        <span className={getGradeColor(student.average_grade)}>
                          {student.average_grade}% Average
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoStatsChartOutline className="w-4 h-4 text-blue-500" />
                        <span className={getAttendanceColor(student.attendance_percentage)}>
                          {student.attendance_percentage}% Attendance
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          openStudentModal(student)
                        }}
                        className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <IoEyeOutline className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`mailto:${student.email}`)
                        }}
                        className="hover:bg-blue-50 hover:border-blue-200"
                      >
                        <IoMailOutline className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Table
              data={filteredStudents}
              columns={[
                {
                  key: 'full_name',
                  title: 'Student',
                  render: (_: any, student: any) => (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {student.full_name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-sm text-gray-600">{student.er_no}</p>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'semester',
                  title: 'Semester',
                  render: (_: any, student: any) => `Sem ${student.semester}`
                },
                {
                  key: 'average_grade',
                  title: 'Average Grade',
                  render: (_: any, student: any) => (
                    <span className={getGradeColor(student.average_grade)}>
                      {student.average_grade}%
                    </span>
                  )
                },
                {
                  key: 'attendance_percentage',
                  title: 'Attendance',
                  render: (_: any, student: any) => (
                    <span className={getAttendanceColor(student.attendance_percentage)}>
                      {student.attendance_percentage}%
                    </span>
                  )
                },
                {
                  key: 'completed_assignments',
                  title: 'Assignments',
                  render: (_: any, student: any) => `${student.completed_assignments}/${student.total_assignments}`
                },
                {
                  key: 'actions',
                  title: 'Actions',
                  render: (_: any, student: any) => (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStudentModal(student)}
                        className="hover:bg-blue-50 hover:border-blue-200"
                      >
                        <IoEyeOutline className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`mailto:${student.email}`)}
                        className="hover:bg-blue-50 hover:border-blue-200"
                      >
                        <IoMailOutline className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                }
              ]}
            />
          </CardContent>
        </Card>
      )}

      {filteredStudents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <IoPeopleOutline className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </motion.div>
      )}

      {/* Student Details Modal */}
      <Modal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        title={`Student Details - ${selectedStudent?.full_name}`}
        size="lg"
      >
        <ModalBody>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Header */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                  {selectedStudent.full_name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedStudent.full_name}</h3>
                  <p className="text-gray-600">{selectedStudent.er_no}</p>
                  <p className="text-sm text-gray-500">Semester {selectedStudent.semester}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoMailOutline className="w-4 h-4" />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoCallOutline className="w-4 h-4" />
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoPersonOutline className="w-4 h-4" />
                      <span>Guardian: {selectedStudent.guardian_contact}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Academic Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoSchoolOutline className="w-4 h-4" />
                      <span>{getDepartmentName(selectedStudent.department_id)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoBookOutline className="w-4 h-4" />
                      <span>Micro: {selectedStudent.micro}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoBookOutline className="w-4 h-4" />
                      <span>Minor: {selectedStudent.minor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Average Grade</p>
                        <p className={`text-2xl font-bold ${getGradeColor(selectedStudent.average_grade)}`}>
                          {selectedStudent.average_grade}%
                        </p>
                      </div>
                      <IoTrophyOutline className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Attendance</p>
                        <p className={`text-2xl font-bold ${getAttendanceColor(selectedStudent.attendance_percentage)}`}>
                          {selectedStudent.attendance_percentage}%
                        </p>
                      </div>
                      <IoStatsChartOutline className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Assignments</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedStudent.completed_assignments}/{selectedStudent.total_assignments}
                        </p>
                      </div>
                      <IoBookOutline className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoTimeOutline className="w-4 h-4" />
                    <span>Last active: {new Date(selectedStudent.last_active).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoCheckmarkOutline className="w-4 h-4" />
                    <span>Completed {selectedStudent.completed_assignments} assignments</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => window.open(`mailto:${selectedStudent?.email}`)}
            className="flex items-center gap-2"
          >
            <IoMailOutline className="w-4 h-4" />
            Send Email
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowStudentModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  )
}