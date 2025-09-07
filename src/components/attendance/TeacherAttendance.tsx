import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  IoSchoolOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline
} from 'react-icons/io5';
import VideoStream from './VideoStream';
import CameraControls from './CameraControls';
import AttendanceRecords from './AttendanceRecords';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { attendanceApi, type ApiStatus, type AttendanceResponse } from '../../services';

export default function TeacherAttendance() {
  // State management
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [personName, setPersonName] = useState('');
  const [personImages, setPersonImages] = useState<FileList | null>(null);
  const [addPersonLoading, setAddPersonLoading] = useState(false);
  const [addPersonMessage, setAddPersonMessage] = useState('');

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

  const refreshStatus = useCallback(async () => {
    try {
      const newStatus = await attendanceApi.getStatus();
      setStatus(newStatus);
      setConnectionError(null);
      return newStatus;
    } catch (error) {
      setConnectionError('Connection lost. Please check Flask server.');
      throw error;
    }
  }, []);

  const refreshAttendanceRecords = useCallback(async () => {
    try {
      const records = await attendanceApi.getAttendanceRecords();
      setAttendanceRecords(records);
      return records;
    } catch (error) {
      throw error;
    }
  }, []);

  const handleStartCamera = async () => {
    setIsLoading(true);
    try {
      const result = await attendanceApi.startCamera();
      await refreshStatus();
      toast.success(result.status || 'Camera started successfully', { icon: '📸' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start camera';
      toast.error(message, { icon: '❌' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopCamera = async () => {
    setIsLoading(true);
    try {
      const result = await attendanceApi.stopCamera();
      await refreshStatus();
      await refreshAttendanceRecords();
      toast.success(result.status || 'Camera stopped successfully', { icon: '🛑' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop camera';
      toast.error(message, { icon: '❌' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddPerson = () => {
    setShowAddPersonModal(true);
    setPersonName('');
    setPersonImages(null);
    setAddPersonMessage('');
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !personImages?.length) {
      setAddPersonMessage('Please provide a name and select at least one image.');
      return;
    }

    setAddPersonLoading(true);
    setAddPersonMessage('');

    try {
      const formData = new FormData();
      formData.append('name', personName.trim());

      for (let i = 0; i < personImages.length; i++) {
        formData.append('images', personImages[i]);
      }

      const response = await fetch('http://127.0.0.1:5000/api/add_person', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add person');

      setAddPersonMessage(data.message || 'Person added successfully!');
      toast.success(data.message || 'Person added successfully!', { icon: '✅' });

      await refreshStatus();
      setTimeout(() => setShowAddPersonModal(false), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add person';
      setAddPersonMessage(message);
      toast.error(message, { icon: '❌' });
    } finally {
      setAddPersonLoading(false);
    }
  };

  const handleVideoError = (error: string) => {
    toast.error(error, { icon: '📹' });
  };

  const handleVideoStreamLoad = () => {
    if (connectionError) {
      setConnectionError(null);
      toast.success('Video stream connected successfully', { icon: '✅' });
    }
  };

  const isConnected = !connectionError && status !== null;

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