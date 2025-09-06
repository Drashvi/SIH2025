import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoSchoolOutline } from "react-icons/io5";
import clsx from 'clsx'
import { useAuth } from "../../hooks/useAuth";
import type { NavItem } from "../../types";

interface SidebarProps {
  navigation: NavItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarExpanded: boolean;
}

export default function Sidebar({ navigation, sidebarOpen, setSidebarOpen, sidebarExpanded }: SidebarProps) {
  const { role } = useAuth();
  const location = useLocation();

  const userRole = role || 'admin';

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-secondary-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:w-64 xl:w-72 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <IoSchoolOutline className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">KNG</h1>
              <p className="text-xs text-white/80">Academic Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all relative z-10"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {filteredNavigation.map((item, index) => {
            const isActive = location.pathname === item.href
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    'group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 overflow-hidden',
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 bg-blue-600 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className="relative flex items-center gap-3 z-10">
                    <div className={clsx(
                      'p-2 rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-white/20 shadow-md' 
                        : 'group-hover:bg-blue-100 group-hover:shadow-sm'
                    )}>
                      <item.icon className={clsx(
                        'w-4 h-4 transition-colors duration-200',
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                      )} />
                    </div>
                    <span className={clsx(
                      'font-medium transition-colors duration-200',
                      isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-700'
                    )}>
                      {item.name}
                    </span>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2024 KNG
          </div>
        </div>
      </div>
    </>
  );
}
