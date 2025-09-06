import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { 
  IoHomeOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoBusinessOutline,
  IoClipboardOutline,
  IoStatsChartOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoSettingsOutline,
  IoLibraryOutline,
  IoTrophyOutline,
  IoChatboxOutline,
  IoPersonAddOutline,
  IoSchoolOutline
} from "react-icons/io5";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { NavItem } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { Outlet } from 'react-router-dom';

// Admin Navigation - Full access
const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: IoHomeOutline, roles: ['admin'] },
  { name: 'Approvals', href: '/approvals', icon: IoPersonAddOutline, roles: ['admin'] },
  { name: 'Analytics', href: '/analytics', icon: IoStatsChartOutline, roles: ['admin'] },
  { name: 'Departments', href: '/departments', icon: IoBusinessOutline, roles: ['admin'] },
  { name: 'People Management', href: '/people', icon: IoPeopleOutline, roles: ['admin'] },
  { name: 'Courses', href: '/courses', icon: IoBookOutline, roles: ['admin'] },
  { name: 'Attendance', href: '/attendance', icon: IoClipboardOutline, roles: ['admin'] },
  { name: 'Reports', href: '/reports', icon: IoDocumentTextOutline, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: IoSettingsOutline, roles: ['admin'] },
];

// Teacher Navigation - Teaching focused
const teacherNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: IoHomeOutline, roles: ['teacher'] },
  { name: 'My Classes', href: '/classes', icon: IoLibraryOutline, roles: ['teacher'] },
  { name: 'Students', href: '/students', icon: IoPeopleOutline, roles: ['teacher'] },
  { name: 'Attendance', href: '/attendance', icon: IoClipboardOutline, roles: ['teacher'] },
  { name: 'Assignments', href: '/assignments', icon: IoDocumentTextOutline, roles: ['teacher'] },
  { name: 'Grades', href: '/grades', icon: IoTrophyOutline, roles: ['teacher'] },
  { name: 'Schedule', href: '/schedule', icon: IoCalendarOutline, roles: ['teacher'] },
  { name: 'Messages', href: '/messages', icon: IoChatboxOutline, roles: ['teacher'] },
];

// Student Navigation - Student focused
const studentNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: IoHomeOutline, roles: ['student'] },
  { name: 'My Courses', href: '/my-courses', icon: IoSchoolOutline, roles: ['student'] },
  { name: 'Schedule', href: '/schedule', icon: IoCalendarOutline, roles: ['student'] },
  { name: 'Assignments', href: '/my-assignments', icon: IoDocumentTextOutline, roles: ['student'] },
  { name: 'Grades', href: '/my-grades', icon: IoTrophyOutline, roles: ['student'] },
  { name: 'Attendance', href: '/attendance', icon: IoClipboardOutline, roles: ['student'] },
  { name: 'Library', href: '/library', icon: IoLibraryOutline, roles: ['student'] },
  { name: 'Messages', href: '/messages', icon: IoChatboxOutline, roles: ['student'] },
];

const getNavigationForRole = (role: string): NavItem[] => {
  switch (role) {
    case 'admin':
      return adminNavigation;
    case 'teacher':
      return teacherNavigation;
    case 'student':
      return studentNavigation;
    default:
      return studentNavigation;
  }
};

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { role } = useAuth();

  const navigation = getNavigationForRole(role || 'student');

  return (
    <div className="flex h-screen w-full">
      <Sidebar 
        navigation={navigation}
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        sidebarExpanded={sidebarExpanded}
      />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden transition-all duration-300 ease-in-out">
        <Header setSidebarOpen={setSidebarOpen} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full min-w-0 overflow-auto"
        >
          <div className="w-full min-w-0 overflow-hidden p-4 sm:p-6 lg:p-8">
            {children || <Outlet />}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
