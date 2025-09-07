import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Modal, { ModalBody, ModalFooter } from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { IoPlayOutline, IoStopOutline, IoCloudUploadOutline, IoRefreshOutline, IoWarningOutline, IoHappyOutline, IoVideocamOffOutline } from 'react-icons/io5'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export default function AttendancePage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [attendanceActive, setAttendanceActive] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [studentName, setStudentName] = useState('')
  const [studentImage, setStudentImage] = useState<FileList | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isApiLoading, setIsApiLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const videoRef = useRef<HTMLImageElement>(null)
  const refreshIntervalRef = useRef<number | null>(null)

  // Fetch initial status and continuously update attendance
  useEffect(() => {
    fetchStatus()
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (cameraActive) {
      refreshIntervalRef.current = window.setInterval(fetchAttendance, 3000)
      // Force reload of the video feed source
      if (videoRef.current) {
        videoRef.current.src = `${API_BASE_URL}/video?t=${new Date().getTime()}`
      }
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [cameraActive])

  // Function to fetch the current status of the camera and attendance
  const fetchStatus = async () => {
    setIsApiLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/status`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setCameraActive(data.camera_active)
      setAttendanceActive(data.attendance_active)
      setStatusMessage(null)
    } catch (error) {
      console.error('Error fetching status:', error)
      setStatusMessage('Failed to connect to attendance server. Please ensure the Python server is running.')
    } finally {
      setIsApiLoading(false)
    }
  }

  // Function to start the camera and attendance
  const startCamera = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/start`, { method: 'POST' })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setCameraActive(true)
      setAttendanceActive(true)
      setStatusMessage(data.status)
    } catch (error) {
      console.error('Error starting camera:', error)
      setStatusMessage(`Failed to start camera. ${error instanceof Error ? error.message : ''}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to stop the camera and attendance
  const stopCamera = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/stop`, { method: 'POST' })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setCameraActive(false)
      setAttendanceActive(false)
      setStatusMessage(data.status)
    } catch (error) {
      console.error('Error stopping camera:', error)
      setStatusMessage(`Failed to stop camera. ${error instanceof Error ? error.message : ''}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to fetch attendance records
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setAttendanceRecords(data.records)
    } catch (error) {
      console.error('Error fetching attendance:', error)
      // Don't show a persistent error for polling failures
    }
  }

  // Function to handle student photo upload
  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName || !studentImage || studentImage.length === 0) {
      setUploadMessage('Please provide both name and at least one image.')
      return
    }
    setIsSubmitting(true)
    setUploadMessage(null)

    const formData = new FormData()
    formData.append('name', studentName)
    for (let i = 0; i < studentImage.length; i++) {
      formData.append('images', studentImage[i])
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add_person`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      setUploadMessage(data.message || 'Student added successfully.')
      setStudentName('')
      setStudentImage(null)
      setShowUploadModal(false)
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadMessage(`Error uploading student: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <Button
          onClick={() => setShowUploadModal(true)}
          variant="primary"
          icon={<IoCloudUploadOutline />}
        >
          Add Student
        </Button>
      </div>

      <AnimatePresence>
        {statusMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className={`border-2 ${statusMessage.includes('Failed') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <IoWarningOutline className="w-5 h-5" />
                <p>{statusMessage}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Control and Video Feed */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Camera Feed</span>
            <div className="flex gap-2">
              <Button
                onClick={startCamera}
                disabled={cameraActive || isSubmitting}
                loading={isSubmitting && !cameraActive}
                variant="primary"
                icon={<IoPlayOutline />}
              >
                Start Camera
              </Button>
              <Button
                onClick={stopCamera}
                disabled={!cameraActive || isSubmitting}
                loading={isSubmitting && cameraActive}
                variant="danger"
                icon={<IoStopOutline />}
              >
                Stop Camera
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative w-full h-[480px] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            <AnimatePresence>
              {cameraActive ? (
                <motion.img
                  ref={videoRef}
                  alt="Live Camera Feed"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-400">
                  <IoVideocamOffOutline className="w-24 h-24 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Camera is Off</h3>
                  <p>Click 'Start Camera' to begin the live feed.</p>
                </motion.div>
              )}
            </AnimatePresence>
            {cameraActive && attendanceActive && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-3 left-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-blue-400 shadow-lg"
              >
                ATTENDANCE ACTIVE
              </motion.span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Attendance</span>
            <Button
              onClick={fetchAttendance}
              variant="outline"
              icon={<IoRefreshOutline />}
              disabled={isApiLoading}
              loading={isApiLoading}
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {attendanceRecords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <IoHappyOutline className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No attendance records yet for today.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Student Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Add New Student to Database"
      >
        <form onSubmit={handleImageUpload}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                <Input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student's full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="studentImages" className="block text-sm font-medium text-gray-700">Upload Photo(s)</label>
                <Input
                  id="studentImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setStudentImage(e.target.files)}
                  required
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-xs text-gray-500">Upload one or more clear photos of the student's face.</p>
              </div>
              {uploadMessage && <p className={`text-sm ${uploadMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{uploadMessage}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} variant="primary">
              Add Student
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </motion.div>
  )
}
