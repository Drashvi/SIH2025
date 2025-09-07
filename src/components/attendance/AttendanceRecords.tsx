import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoPersonOutline,
  IoTimeOutline,
  IoRefreshOutline,
  IoDownloadOutline,
  IoCheckmarkCircleOutline,
  IoListOutline,
  IoWarningOutline
} from 'react-icons/io5';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import type { AttendanceRecord, AttendanceResponse } from '../../services';

interface AttendanceRecordsProps {
  records: AttendanceResponse | null;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function AttendanceRecords({
  records,
  isLoading,
  onRefresh,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: AttendanceRecordsProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      if (!refreshing && !isLoading) {
        await handleRefresh();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshing, isLoading]);

  // Update last updated time when records change
  useEffect(() => {
    if (records) {
      setLastUpdated(new Date());
    }
  }, [records]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownload = () => {
    if (!records || !records.records.length) return;

    // Create CSV content
    const csvHeader = 'Name,Time\n';
    const csvContent = records.records
      .map(record => `"${record.name}","${record.time}"`)
      .join('\n');
    
    const fullCsv = csvHeader + csvContent;
    
    // Create and download file
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${records.date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes, seconds] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-green-500">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <IoListOutline className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl">Today's Attendance</span>
              {records?.date && (
                <p className="text-sm font-normal text-gray-600 mt-1">
                  {formatDate(records.date)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm text-gray-600">
              <div>Last updated: {formatLastUpdated()}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                {autoRefresh ? 'Auto-refresh on' : 'Manual refresh'}
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <IoRefreshOutline className={`w-4 h-4 mr-2 ${
                (refreshing || isLoading) ? 'animate-spin' : ''
              }`} />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <IoPersonOutline className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {records?.records.length || 0}
                </p>
                <p className="text-sm text-blue-600">Total Present</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <IoCheckmarkCircleOutline className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {records?.records.length ? '100%' : '0%'}
                </p>
                <p className="text-sm text-green-600">Attendance Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <IoTimeOutline className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {records?.records.length ? 
                    records.records[records.records.length - 1].time.split(':').slice(0, 2).join(':') 
                    : '--:--'
                  }
                </p>
                <p className="text-sm text-purple-600">Last Check-in</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Records Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance Records
            </h3>
            <Button
              onClick={handleDownload}
              disabled={!records?.records.length}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <IoDownloadOutline className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-600">Loading attendance records...</p>
              </motion.div>
            </div>
          ) : !records?.records.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <IoWarningOutline className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Attendance Records
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Start the camera to begin tracking attendance. 
                  Students will be automatically marked present when their faces are detected.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {records.records.map((record: AttendanceRecord, index: number) => (
                        <motion.tr
                          key={`${record.name}-${record.time}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-green-600 font-semibold text-sm">
                                  {record.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {record.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <IoTimeOutline className="w-4 h-4 text-gray-400" />
                              {formatTime(record.time)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Present
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}