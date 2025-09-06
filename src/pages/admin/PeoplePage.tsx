import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoPeopleOutline,
  IoAddOutline,
  IoSearchOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoPersonOutline,
  IoBookOutline,
  IoStatsChartOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoFilterOutline,
  IoSchoolOutline,
  IoBusinessOutline
} from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export default function PeoplePage() {
  const [showModal, setShowModal] = useState(false)
  const [editingPerson, setEditingPerson] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    approval_status: 'pending' as 'pending' | 'approved' | 'rejected',
    
    // Student-specific fields
    er_no: '',
    semester: '',
    gender: '',
    micro: '',
    minor: '',
    department_id: '' as Id<"departments"> | '',
    guardian_contact: '',
    
    // Teacher-specific fields
    additional_courses: [] as string[],
    subject_assigned: '',
    
    // Admin-specific fields
    admin_role: ''
  })

  // Fetch data
  const people = useQuery(api.people.getAllPeople)
  const departments = useQuery(api.departments.getAllDepartments)
  
  // Mutations
  const createPerson = useMutation(api.people.createPerson)
  const updatePerson = useMutation(api.people.updatePerson)
  const deletePerson = useMutation(api.people.deletePerson)

  const filteredPeople = (people || []).filter(person => {
    const matchesSearch = person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.er_no?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || person.role === filterRole
    const matchesStatus = filterStatus === 'all' || person.approval_status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const personData = {
        ...formData,
        user_id: `temp_${Date.now()}`, // In real app, this would come from Clerk
        department_id: formData.department_id || undefined,
        additional_courses: formData.additional_courses.length > 0 ? formData.additional_courses : undefined,
        admin_role: formData.admin_role || undefined
      }

      if (editingPerson) {
        await updatePerson({
          id: editingPerson._id,
          ...personData
        })
      } else {
        await createPerson(personData)
      }
      
      setShowModal(false)
      setEditingPerson(null)
      resetForm()
    } catch (error) {
      console.error('Error saving person:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: 'student',
      approval_status: 'pending',
      er_no: '',
      semester: '',
      gender: '',
      micro: '',
      minor: '',
      department_id: '',
      guardian_contact: '',
      additional_courses: [],
      subject_assigned: '',
      admin_role: ''
    })
  }

  const handleEdit = (person: any) => {
    setEditingPerson(person)
    setFormData({
      full_name: person.full_name,
      email: person.email,
      phone: person.phone || '',
      role: person.role,
      approval_status: person.approval_status || 'pending',
      er_no: person.er_no || '',
      semester: person.semester || '',
      gender: person.gender || '',
      micro: person.micro || '',
      minor: person.minor || '',
      department_id: person.department_id || '',
      guardian_contact: person.guardian_contact || '',
      additional_courses: person.additional_courses || [],
      subject_assigned: person.subject_assigned || '',
      admin_role: person.admin_role || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: Id<"people">) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await deletePerson({ id })
      } catch (error) {
        console.error('Error deleting person:', error)
      }
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return IoSchoolOutline
      case 'teacher': return IoBookOutline
      case 'admin': return IoBusinessOutline
      default: return IoPersonOutline
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-600'
      case 'teacher': return 'bg-green-100 text-green-600'
      case 'admin': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!people) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading people...</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            People Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage students, teachers, and administrators
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <IoAddOutline className="w-5 h-5 mr-2" />
          Add Person
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoPeopleOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total People</p>
                <p className="text-2xl font-bold text-gray-900">{people.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {people.filter(p => p.role === 'teacher').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoSchoolOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {people.filter(p => p.role === 'student').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <IoStatsChartOutline className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {people.filter(p => p.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPeople.map((person, index) => {
            const RoleIcon = getRoleIcon(person.role)
            
            return (
              <motion.div
                key={person._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader className="bg-blue-50 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <RoleIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{person.full_name}</CardTitle>
                          <p className="text-sm text-gray-600">{person.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(person)}
                        >
                          <IoPencilOutline className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(person._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
                          {person.role.charAt(0).toUpperCase() + person.role.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(person.approval_status || 'pending')}`}>
                          {person.approval_status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {person.er_no && (
                          <div className="flex items-center gap-2">
                            <IoPersonOutline className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">ER No: {person.er_no}</span>
                          </div>
                        )}
                        {person.semester && (
                          <div className="flex items-center gap-2">
                            <IoBookOutline className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Semester: {person.semester}</span>
                          </div>
                        )}
                        {person.subject_assigned && (
                          <div className="flex items-center gap-2">
                            <IoBookOutline className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Subject: {person.subject_assigned}</span>
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-2">
                            <IoCheckmarkOutline className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{person.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <IoEyeOutline className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredPeople.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <IoPeopleOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No people found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'Get started by adding your first person'
              }
            </p>
            {!searchTerm && filterRole === 'all' && filterStatus === 'all' && (
              <Button onClick={() => setShowModal(true)}>
                <IoAddOutline className="w-5 h-5 mr-2" />
                Add Person
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Person Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBody>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingPerson ? 'Edit Person' : 'Add New Person'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status
                  </label>
                  <select
                    value={formData.approval_status}
                    onChange={(e) => setFormData({ ...formData, approval_status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments?.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student-specific fields */}
              {formData.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrollment Number
                    </label>
                    <Input
                      value={formData.er_no}
                      onChange={(e) => setFormData({ ...formData, er_no: e.target.value })}
                      placeholder="Enter enrollment number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <Input
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      placeholder="Enter semester"
                    />
                  </div>
                </div>
              )}

              {/* Teacher-specific fields */}
              {formData.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Assigned
                  </label>
                  <Input
                    value={formData.subject_assigned}
                    onChange={(e) => setFormData({ ...formData, subject_assigned: e.target.value })}
                    placeholder="Enter assigned subject"
                  />
                </div>
              )}

              {/* Admin-specific fields */}
              {formData.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Role
                  </label>
                  <Input
                    value={formData.admin_role}
                    onChange={(e) => setFormData({ ...formData, admin_role: e.target.value })}
                    placeholder="Enter admin role"
                  />
                </div>
              )}
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            <IoCloseOutline className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <IoCheckmarkOutline className="w-4 h-4 mr-2" />
            {editingPerson ? 'Update' : 'Create'} Person
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  )
}
