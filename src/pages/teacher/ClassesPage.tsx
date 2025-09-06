import { motion } from 'framer-motion'
import { IoLibraryOutline } from 'react-icons/io5'

export default function ClassesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-8'
    >
      <div className='text-center py-20'>
        <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center'>
          <IoLibraryOutline className='w-12 h-12 text-emerald-600' />
        </div>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2'>My Classes</h1>
        <p className='text-gray-600'>Manage your teaching classes and schedules</p>
      </div>
    </motion.div>
  )
}
