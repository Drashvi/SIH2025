import { motion } from 'framer-motion'
import { IoDocumentTextOutline, IoDownloadOutline, IoFilterOutline, IoStatsChartOutline } from 'react-icons/io5'
import { Card, CardContent, Button } from '../../components/ui'

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reports & Analytics 📈
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Generate comprehensive reports and export institutional data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <IoFilterOutline className="w-4 h-4" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white flex items-center gap-2">
            <IoDownloadOutline className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { title: 'Student Performance Report', desc: 'Academic performance analytics', icon: IoStatsChartOutline },
          { title: 'Attendance Report', desc: 'Class attendance summaries', icon: IoDocumentTextOutline },
          { title: 'Financial Report', desc: 'Revenue and expense analysis', icon: IoDocumentTextOutline },
          { title: 'Faculty Report', desc: 'Teacher performance metrics', icon: IoDocumentTextOutline },
          { title: 'Department Report', desc: 'Departmental statistics', icon: IoDocumentTextOutline },
          { title: 'Custom Report', desc: 'Build your own report', icon: IoDocumentTextOutline }
        ].map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <report.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{report.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{report.desc}</p>
                <Button size="sm" className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
