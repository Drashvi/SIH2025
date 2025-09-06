import { motion } from 'framer-motion'
import { IoPeopleOutline } from 'react-icons/io5'

export default function StudentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
          <IoPeopleOutline className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">Students</h1>
        <p className="text-gray-600">Manage your students and their progress</p>
      </div>
    </motion.div>
  )
}
