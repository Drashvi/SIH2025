import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IoMenuOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoPersonCircleOutline,
  IoChevronDownOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui'
import AuthButton from "../auth/AuthButton";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

export default function Header({ setSidebarOpen, sidebarExpanded, setSidebarExpanded }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { dbUser } = useAuth()

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
          <Button
            variant="ghost"
            size="sm"
            className="!p-1.5 sm:!p-2 relative"
          >
            <IoNotificationsOutline className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-danger-500 rounded-full text-[8px] sm:text-[10px] text-white flex items-center justify-center">3</span>
          </Button>
          
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
