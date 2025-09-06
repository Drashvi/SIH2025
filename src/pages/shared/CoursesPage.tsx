import { motion } from 'framer-motion'
import { IoBookOutline } from 'react-icons/io5'

export default function CoursesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
          <IoBookOutline className="w-12 h-12 text-teal-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">Courses</h1>
        <p className="text-gray-600">Browse and manage course catalog</p>
      </div>
    </motion.div>
  )
}
