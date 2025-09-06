import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoPersonAddOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoEyeOutline,
  IoSearchOutline,
  IoMailOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoPersonOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { Card, CardContent, Button, Input, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'


export default function ApprovalsPage() {
  // Fetch pending users from backend
  const pendingUsers = useQuery(api.people.getPeopleByApprovalStatus, { status: "pending" })
  const departments = useQuery(api.departments.getAllDepartments)
  
  // Mutations for approval/rejection
  const approveUser = useMutation(api.people.approveUser)
  const rejectUser = useMutation(api.people.rejectUser)
  
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all') // all, teacher, student
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = (pendingUsers || []).filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleApprove = async (userId: Id<"people">) => {
    try {
      await approveUser({ id: userId })
      setShowModal(false)
    } catch (error) {
      console.error('Error approving user:', error)
    }
  }

  const handleReject = async (userId: Id<"people">) => {
    try {
      await rejectUser({ id: userId })
      setShowModal(false)
    } catch (error) {
      console.error('Error rejecting user:', error)
    }
  }

  const openUserDetails = (user: any) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const getRoleBadge = (role: string) => {
    if (role === 'teacher') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <IoPersonOutline className="w-3 h-3" />
          Teacher
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <IoSchoolOutline className="w-3 h-3" />
          Student
        </span>
      )
    }
  }

  const getFilterCount = (type: string) => {
    if (!pendingUsers) return 0
    if (type === 'all') return pendingUsers.length
    return pendingUsers.filter(u => u.role === type).length
  }
  
  // Helper function to get department name
  const getDepartmentName = (departmentId?: Id<"departments">) => {
    if (!departmentId || !departments) return 'N/A'
    const dept = departments.find(d => d._id === departmentId)
    return dept?.department_name || 'N/A'
  }

  if (!pendingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading pending approvals...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4 sm:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent leading-tight break-words">
            Approval Center ⚡
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg break-words">
            Review and approve new teacher and student registration requests
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="font-medium whitespace-nowrap">{getFilterCount('all')} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm w-full overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-5 h-5" />}
                className="bg-white/50"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: getFilterCount('all') },
                { key: 'teacher', label: 'Teachers', count: getFilterCount('teacher') },
                { key: 'student', label: 'Students', count: getFilterCount('student') }
              ].map((item) => (
                <Button
                  key={item.key}
                  variant={filter === item.key ? "primary" : "outline"}
                  onClick={() => setFilter(item.key)}
                  className={`flex items-center gap-2 ${
                    filter === item.key 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'hover:bg-purple-50 hover:border-purple-200'
                  }`}
                >
                  {item.label}
                  {item.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      filter === item.key 
                        ? 'bg-white/20 text-white' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group w-full">
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                <CardContent className="p-4 sm:p-6 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 w-full">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                        {user.full_name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{user.full_name}</h3>
                        <div className="mt-1">{getRoleBadge(user.role)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 w-full">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
                      <IoMailOutline className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="truncate min-w-0 flex-1">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
                      <IoCallOutline className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
                      <IoTimeOutline className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="truncate">Applied {new Date(user._creationTime).toLocaleDateString()}</span>
                    </div>
                    {user.department_id && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
                        <IoSchoolOutline className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                        <span className="truncate min-w-0 flex-1">{getDepartmentName(user.department_id)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUserDetails(user)}
                      className="flex-1 hover:bg-purple-50 hover:border-purple-200 whitespace-nowrap"
                    >
                      <IoEyeOutline className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs sm:text-sm">Review</span>
                    </Button>
                    <div className="flex gap-2 sm:flex-1">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(user._id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg whitespace-nowrap"
                      >
                        <IoCheckmarkCircleOutline className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="text-xs sm:text-sm">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReject(user._id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg px-2 sm:px-3 shrink-0"
                      >
                        <IoCloseCircleOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <IoPersonAddOutline className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending approval requests at the moment.</p>
        </motion.div>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Application Details"
        size="lg"
      >
        {selectedUser && (
          <>
            <ModalBody>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {selectedUser.full_name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.full_name}</h3>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <IoMailOutline className="w-5 h-5 text-purple-500" />
                        <span className="text-gray-700">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <IoCallOutline className="w-5 h-5 text-purple-500" />
                        <span className="text-gray-700">{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {selectedUser.role === 'teacher' ? 'Academic' : 'Program'} Details
                    </h4>
                    <div className="space-y-3">
                      {selectedUser.role === 'teacher' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Department</label>
                            <p className="text-gray-900">{getDepartmentName(selectedUser.department_id)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Primary Subject</label>
                            <p className="text-gray-900">{selectedUser.subject_assigned || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Role</label>
                            <p className="text-gray-900">Teacher</p>
                          </div>
                        </>
                      ) : selectedUser.role === 'student' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Department</label>
                            <p className="text-gray-900">{getDepartmentName(selectedUser.department_id)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Enrollment Number</label>
                            <p className="text-gray-900">{selectedUser.er_no || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Semester</label>
                            <p className="text-gray-900">{selectedUser.semester || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Gender</label>
                            <p className="text-gray-900">{selectedUser.gender || 'N/A'}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Admin Role</label>
                            <p className="text-gray-900">{selectedUser.admin_role || 'System Administrator'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg">Application Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Date</label>
                      <p className="text-gray-900">{new Date(selectedUser._creationTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <p className="text-gray-900 capitalize">{selectedUser.approval_status || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleReject(selectedUser._id)}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
              >
                <IoCloseCircleOutline className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(selectedUser._id)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <IoCheckmarkCircleOutline className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </motion.div>
  )
}
