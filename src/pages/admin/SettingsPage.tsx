import { motion } from 'framer-motion'
import { IoSettingsOutline } from 'react-icons/io5'

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <IoSettingsOutline className="w-12 h-12 text-gray-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">System configuration and preferences</p>
      </div>
    </motion.div>
  )
}
