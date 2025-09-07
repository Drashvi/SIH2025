import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { attendanceApi, type ApiStatus, type AttendanceResponse } from '../../services';

export default function TeacherAttendance() {
  // State management
  const [, setStatus] = useState<ApiStatus | null>(null);
  const [, setAttendanceRecords] = useState<AttendanceResponse | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [, setConnectionError] = useState<string | null>(null);

  // Initialize component by fetching initial data
  useEffect(() => {
    initializeAttendance();
  }, []);

  const initializeAttendance = async () => {
    setIsInitialLoading(true);
    try {
      const [statusResult, recordsResult] = await Promise.allSettled([
        attendanceApi.getStatus(),
        attendanceApi.getAttendanceRecords()
      ]);

      if (statusResult.status === 'fulfilled') {
        setStatus(statusResult.value);
        setConnectionError(null);
      } else {
        setConnectionError('Failed to connect to Flask server. Please check if it\'s running on port 5000.');
      }

      if (recordsResult.status === 'fulfilled') {
        setAttendanceRecords(recordsResult.value);
      }

    } catch (error) {
      setConnectionError('Failed to initialize attendance system.');
    } finally {
      setIsInitialLoading(false);
    }
  };


  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Initializing Face Detection System</h2>
          <p className="text-gray-600">Connecting to Flask server...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    </div>
  );
}