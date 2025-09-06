import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IoMenuOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoPersonCircleOutline,
  IoChevronDownOutline,
  IoSettingsOutline,
  IoClipboardOutline,
  IoTrophyOutline,
  IoAlarmOutline,
  IoWarningOutline,
  IoCheckmarkOutline,
  IoTrashOutline
} from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui'
import AuthButton from "../auth/AuthButton";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

// Notification data
const notificationsData = [
  {
    id: 1,
    title: 'New Assignment Posted',
    message: 'Data Structures - Algorithm Analysis Report due tomorrow',
    type: 'assignment',
    time: '2 hours ago',
    isRead: false,
    icon: IoClipboardOutline,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    title: 'Grade Released',
    message: 'Database Design Project - Grade: A-',
    type: 'grade',
    time: '4 hours ago',
    isRead: false,
    icon: IoTrophyOutline,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 3,
    title: 'Class Reminder',
    message: 'Software Engineering class starts in 30 minutes',
    type: 'reminder',
    time: '1 day ago',
    isRead: true,
    icon: IoAlarmOutline,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 4,
    title: 'Announcement',
    message: 'Library will be closed this weekend for maintenance',
    type: 'announcement',
    time: '2 days ago',
    isRead: true,
    icon: IoNotificationsOutline,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 5,
    title: 'Attendance Alert',
    message: 'Your attendance is below 75% in Mathematics',
    type: 'warning',
    time: '3 days ago',
    isRead: false,
    icon: IoWarningOutline,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
]

export default function Header({ setSidebarOpen, sidebarExpanded, setSidebarExpanded }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(notificationsData)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const { dbUser } = useAuth()

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <header className="bg-white border-b border-secondary-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          icon={<IoMenuOutline className="w-5 h-5" />}
          className="lg:hidden !p-2"
        >
          <span className="sr-only">Open sidebar</span>
        </Button>
        
        {/* Search bar */}
        <div className="flex-1 max-w-md lg:max-w-lg mx-3 sm:mx-4 lg:mx-6 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="h-4 w-4 lg:h-5 lg:w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-8 lg:pl-10 pr-3 py-1.5 lg:py-2 border border-secondary-300 rounded-lg bg-secondary-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm transition-colors"
            />
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="sm"
              className="!p-1.5 sm:!p-2 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <IoNotificationsOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-danger-500 rounded-full text-[8px] sm:text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={markAllAsRead}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <IoCheckmarkOutline className="w-4 h-4 mr-1" />
                            Mark all read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={clearAllNotifications}
                          className="text-red-600 hover:text-red-700"
                        >
                          <IoTrashOutline className="w-4 h-4 mr-1" />
                          Clear all
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <IoNotificationsOutline className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                              <notification.icon className={`w-5 h-5 ${notification.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  {!notification.isRead && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-blue-600 hover:text-blue-700 p-1"
                                    >
                                      <IoCheckmarkOutline className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                  >
                                    <IoTrashOutline className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 !px-2 sm:!px-3"
            >
              <IoPersonCircleOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-secondary-900 truncate max-w-32">
                  {dbUser?.full_name}
                </div>
                <div className="text-xs text-secondary-500">
                  {dbUser?.role}
                </div>
              </div>
              <IoChevronDownOutline className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                userMenuOpen ? 'rotate-180' : ''
              }`} />
            </Button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-secondary-200 rounded-lg shadow-soft-lg z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <div className="text-sm font-medium text-secondary-900">
                        {dbUser?.full_name}
                      </div>
                      <div className="text-xs text-secondary-500">
                        {dbUser?.email}
                      </div>
                    </div>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors">
                      <IoSettingsOutline className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    
                    <div className="px-4 py-2">
                      <AuthButton />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
