import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoPlayOutline,
  IoStopOutline,
  IoToggleOutline,
  IoSettingsOutline,
  IoVideocamOutline,
  IoVideocamOffOutline,
  IoPeopleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoPersonAddOutline
} from 'react-icons/io5';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import Button from '../ui/Button';
import { attendanceApi, type ApiStatus } from '../../services';

interface CameraControlsProps {
  status: ApiStatus | null;
  isLoading: boolean;
  onStartCamera: () => Promise<void>;
  onStopCamera: () => Promise<void>;
  onOpenAddPerson: () => void;
  disabled?: boolean;
}

export default function CameraControls({
  status,
  isLoading,
  onStartCamera,
  onStopCamera,
  onOpenAddPerson,
  disabled = false
}: CameraControlsProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: string, handler: () => Promise<void>) => {
    if (disabled || actionLoading) return;
    
    setActionLoading(action);
    try {
      await handler();
    } finally {
      setActionLoading(null);
    }
  };

  const isButtonLoading = (action: string) => actionLoading === action || isLoading;

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <IoVideocamOutline className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl">Camera Controls</span>
          <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
            status?.camera_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {status?.camera_active ? 'Active' : 'Inactive'}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                status?.camera_active ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {status?.camera_active ? (
                  <IoVideocamOutline className="w-5 h-5 text-green-600" />
                ) : (
                  <IoVideocamOffOutline className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Camera</p>
                <p className={`text-sm ${
                  status?.camera_active ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {status?.camera_active ? 'Running' : 'Stopped'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                status?.attendance_active ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {status?.attendance_active ? (
                  <IoCheckmarkCircleOutline className="w-5 h-5 text-blue-600" />
                ) : (
                  <IoCloseCircleOutline className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Attendance</p>
                <p className={`text-sm ${
                  status?.attendance_active ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {status?.attendance_active ? 'Tracking' : 'Paused'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IoPeopleOutline className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-sm text-purple-600">
                  {status?.people_in_database || 0} People
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Start Camera Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => handleAction('start', onStartCamera)}
              disabled={disabled || status?.camera_active || isButtonLoading('start')}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <div className="text-center">
                {isButtonLoading('start') ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <IoPlayOutline className="w-6 h-6 mx-auto" />
                )}
                <span className="block text-sm mt-1">Start Camera</span>
              </div>
            </Button>
          </motion.div>

          {/* Stop Camera Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => handleAction('stop', onStopCamera)}
              disabled={disabled || !status?.camera_active || isButtonLoading('stop')}
              variant="outline"
              className="w-full h-16 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <div className="text-center">
                {isButtonLoading('stop') ? (
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <IoStopOutline className="w-6 h-6 mx-auto" />
                )}
                <span className="block text-sm mt-1">Stop Camera</span>
              </div>
            </Button>
          </motion.div>

          {/* Attendance Toggle (Info only - controlled by start/stop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              disabled={true}
              variant="outline"
              className={`w-full h-16 cursor-default ${
                status?.attendance_active
                  ? 'border-2 border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-2 border-gray-300 bg-gray-50 text-gray-500'
              }`}
              size="lg"
            >
              <div className="text-center">
                <IoToggleOutline className="w-6 h-6 mx-auto" />
                <span className="block text-sm mt-1">
                  {status?.attendance_active ? 'Tracking On' : 'Tracking Off'}
                </span>
              </div>
            </Button>
          </motion.div>

          {/* Add Person Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => handleAction('add_person', onOpenAddPerson)}
              disabled={disabled || isLoading}
              variant="outline"
              className="w-full h-16 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600"
              size="lg"
            >
              <div className="text-center">
                <IoPersonAddOutline className="w-6 h-6 mx-auto" />
                <span className="block text-sm mt-1">Add Person</span>
              </div>
            </Button>
          </motion.div>

        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <IoTimeOutline className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Quick Instructions:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Click "Start Camera" to begin face detection and attendance tracking</li>
                <li>• The system will automatically mark attendance when faces are recognized</li>
                <li>• Use the "Add Person" button to add new people to the face recognition database</li>
                <li>• Click "Stop Camera" to end the session and save attendance data</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
