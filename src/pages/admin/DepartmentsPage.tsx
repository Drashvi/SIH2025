import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoBusinessOutline,
  IoAddOutline,
  IoSearchOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoStatsChartOutline,
  IoCheckmarkOutline,
  IoCloseOutline
} from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export default function DepartmentsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    department_name: '',
    head_of_department: '' as Id<"people"> | '',
    liaison_teacher: '' as Id<"people"> | ''
  })

  // Fetch data
  const departments = useQuery(api.departments.getAllDepartments)
  const people = useQuery(api.people.getAllPeople)
  
  // Mutations
  const createDepartment = useMutation(api.departments.createDepartment)
  const updateDepartment = useMutation(api.departments.updateDepartment)
  const deleteDepartment = useMutation(api.departments.deleteDepartment)

  const filteredDepartments = (departments || []).filter(dept =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingDepartment) {
        await updateDepartment({
          id: editingDepartment._id,
          ...formData
        })
      } else {
        await createDepartment(formData)
      }
      setShowModal(false)
      setEditingDepartment(null)
      setFormData({
        department_name: '',
        head_of_department: '',
        liaison_teacher: ''
      })
    } catch (error) {
      console.error('Error saving department:', error)
    }
  }

  const handleEdit = (department: any) => {
    setEditingDepartment(department)
    setFormData({
      department_name: department.department_name,
      head_of_department: department.head_of_department || '',
      liaison_teacher: department.liaison_teacher || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: Id<"departments">) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment({ id })
      } catch (error) {
        console.error('Error deleting department:', error)
      }
    }
  }

  if (!departments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading departments...</p>
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
            Departments Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage academic departments and their information
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <IoAddOutline className="w-5 h-5 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoBusinessOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoPeopleOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {people?.filter(p => p.role === 'teacher').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoBookOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + (dept.courses?.length || 0), 0)}
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
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
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
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDepartments.map((department, index) => (
            <motion.div
              key={department._id}
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
                        <IoBusinessOutline className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{department.department_name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Department
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(department)}
                      >
                        <IoPencilOutline className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(department._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <IoTrashOutline className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      Department of {department.department_name}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      {department.head_of_department && (
                        <div className="flex items-center gap-2">
                          <IoPeopleOutline className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Head: {department.head_of_department}</span>
                        </div>
                      )}
                      {department.liaison_teacher && (
                        <div className="flex items-center gap-2">
                          <IoBusinessOutline className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Liaison: {department.liaison_teacher}</span>
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
          ))}
        </AnimatePresence>
      </div>

      {filteredDepartments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <IoBusinessOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first department'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowModal(true)}>
                <IoAddOutline className="w-5 h-5 mr-2" />
                Add Department
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Department Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBody>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <Input
                  value={formData.department_name}
                  onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Head of Department
                  </label>
                  <select
                    value={formData.head_of_department}
                    onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Head of Department</option>
                    {people?.filter(p => p.role === 'teacher').map(person => (
                      <option key={person._id} value={person._id}>{person.full_name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liaison Teacher
                  </label>
                  <select
                    value={formData.liaison_teacher}
                    onChange={(e) => setFormData({ ...formData, liaison_teacher: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Liaison Teacher</option>
                    {people?.filter(p => p.role === 'teacher').map(person => (
                      <option key={person._id} value={person._id}>{person.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
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
            {editingDepartment ? 'Update' : 'Create'} Department
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  )
}
