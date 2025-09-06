import { motion } from 'framer-motion'
import { IoDocumentTextOutline } from 'react-icons/io5'

export default function AssignmentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
          <IoDocumentTextOutline className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">Assignments</h1>
        <p className="text-gray-600">Create and manage student assignments</p>
      </div>
    </motion.div>
  )
}
