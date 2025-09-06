import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { IoPlayOutline, IoStopOutline, IoCloudUploadOutline, IoDownloadOutline, IoEyeOutline, IoRefreshOutline, IoWarningOutline, IoHappyOutline } from 'react-icons/io5'

const API_BASE_URL = 'http://127.0.0.1:5000/api'
const API_KEY = import.meta.env.VITE_PYTHON_API_KEY || 'your_api_key_here' // Replace with your actual API key or env var

export default function AttendancePage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [attendanceActive, setAttendanceActive] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [studentName, setStudentName] = useState('')
  const [studentImage, setStudentImage] = useState<File | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const videoRef = useRef<HTMLImageElement>(null)

  // Fetch initial status and continuously update attendance
  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchAttendance, 3000) // Poll for attendance every 3 seconds
    return () => clearInterval(interval)
  }, [])

  // Function to fetch the current status of the camera and attendance
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`, {
        headers: { 'x-api-key': API_KEY },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCameraActive(data.camera_active)
      setAttendanceActive(data.attendance_active)
      setStatusMessage(null)
    } catch (error) {
      console.error('Error fetching status:', error)
      setStatusMessage('Failed to connect to attendance server. Please ensure the Python server is running.')
    }
  }

  // Function to start the camera and attendance
  const startCamera = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setCameraActive(true)
      setAttendanceActive(true)
      setStatusMessage('Camera started, attendance active.')
    } catch (error) {
      console.error('Error starting camera:', error)
      setStatusMessage('Failed to start camera. ' + (error instanceof Error ? error.message : ''))
    } finally {
      setLoading(false)
    }
  }

  // Function to stop the camera and attendance
  const stopCamera = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/stop`, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setCameraActive(false)
      setAttendanceActive(false)
      setStatusMessage('Camera stopped, attendance stopped.')
    } catch (error) {
      console.error('Error stopping camera:', error)
      setStatusMessage('Failed to stop camera. ' + (error instanceof Error ? error.message : ''))
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch attendance records
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        headers: { 'x-api-key': API_KEY },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAttendanceRecords(data.records)
    } catch (error) {
      console.error('Error fetching attendance:', error)
      setStatusMessage('Failed to fetch attendance records.')
    }
  }

  // Function to handle student photo upload
  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName || !studentImage) {
      setUploadMessage('Please provide both name and image.')
      return
    }
    setLoading(true)
    setUploadMessage(null)

    const formData = new FormData()
    formData.append('name', studentName)
    formData.append('images', studentImage)

    try {
      const response = await fetch(`${API_BASE_URL}/add_person_upload`, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY },
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUploadMessage(data.status || 'Student added successfully.')
      setStudentName('')
      setStudentImage(null)
      setShowUploadModal(false)
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadMessage('Error uploading student: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>

      {statusMessage && (
        <Card className="bg-red-50 border-red-200 text-red-700">
          <CardContent className="p-4 flex items-center gap-2">
            <IoWarningOutline className="w-5 h-5" />
            <p>{statusMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Camera Control and Video Feed */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Camera Feed</span>
            <div className="flex gap-2">
              <Button
                onClick={startCamera}
                disabled={cameraActive || loading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
              >
                <IoPlayOutline />
                {loading && cameraActive ? 'Starting...' : 'Start Camera'}
              </Button>
              <Button
                onClick={stopCamera}
                disabled={!cameraActive || loading}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
              >
                <IoStopOutline />
                {loading && !cameraActive ? 'Stopping...' : 'Stop Camera'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {cameraActive ? (
            <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
              <img
                ref={videoRef}
                src={`${API_BASE_URL}/video`}
                alt="Live Camera Feed"
                className="w-full h-full object-cover"
              />
              {attendanceActive && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  ATTENDANCE ACTIVE
                </span>
              )}
            </div>
          ) : (
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              <p>Camera is stopped. Click 'Start Camera' to begin.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Student Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add New Student</span>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            >
              <IoCloudUploadOutline />
              Upload Photo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadMessage && (
            <div className={`mb-4 p-3 rounded-md ${uploadMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {uploadMessage}
            </div>
          )}
          <p className="text-gray-600">Upload multiple photos of a student to add them to the face recognition database. Make sure the face is clear in the photos.</p>
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
              className="flex items-center gap-1"
            >
              <IoRefreshOutline />
              Refresh
            </Button>
            {/* <Button variant="outline" className="flex items-center gap-1">
              <IoDownloadOutline />
              Export CSV
            </Button> */}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {attendanceRecords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <IoHappyOutline className="w-12 h-12 mx-auto mb-4" />
              No attendance records yet for today.
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
                    <tr key={index}>
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
        title="Upload Student Photo"
      >
        <form onSubmit={handleImageUpload}>
          <ModalBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <Input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student's full name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Photo(s)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setStudentImage(e.target.files ? e.target.files[0] : null)}
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-500">Upload a clear photo of the student's face.</p>
            </div>
            {uploadMessage && <p className={`text-sm ${uploadMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{uploadMessage}</p>}
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Uploading...' : 'Add Student'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </motion.div>
  )
}
