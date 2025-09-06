import { motion } from 'framer-motion'
import { IoTrophyOutline } from 'react-icons/io5'

export default function GradesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
          <IoTrophyOutline className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-2">Grades</h1>
        <p className="text-gray-600">Manage student grades and evaluations</p>
      </div>
    </motion.div>
  )
}
