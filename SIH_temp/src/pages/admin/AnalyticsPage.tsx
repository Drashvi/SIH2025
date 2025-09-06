import { motion } from 'framer-motion'
import {
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoStatsChartOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoEyeOutline,
  IoDownloadOutline,
  IoFilterOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui'

// Mock analytics data
const performanceMetrics = [
  {
    title: 'Student Enrollment',
    value: '2,847',
    change: '+12.3%',
    trend: 'up',
    period: 'vs last month',
    icon: IoPeopleOutline,
    color: 'blue',
    data: [65, 78, 82, 89, 95, 102, 112]
  },
  {
    title: 'Course Completion',
    value: '89.2%',
    change: '+5.7%',
    trend: 'up',
    period: 'vs last month',
    icon: IoBookOutline,
    color: 'green',
    data: [78, 82, 85, 87, 88, 89, 89.2]
  },
  {
    title: 'Average GPA',
    value: '3.45',
    change: '-0.12',
    trend: 'down',
    period: 'vs last semester',
    icon: IoStatsChartOutline,
    color: 'orange',
    data: [3.6, 3.58, 3.52, 3.48, 3.46, 3.45, 3.45]
  },
  {
    title: 'Teacher Satisfaction',
    value: '4.6/5',
    change: '+0.3',
    trend: 'up',
    period: 'vs last survey',
    icon: IoTimeOutline,
    color: 'purple',
    data: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.6]
  }
]

const departmentStats = [
  { name: 'Computer Science', students: 542, growth: '+15%', color: 'bg-blue-500' },
  { name: 'Engineering', students: 487, growth: '+8%', color: 'bg-green-500' },
  { name: 'Business', students: 423, growth: '+12%', color: 'bg-purple-500' },
  { name: 'Mathematics', students: 356, growth: '+3%', color: 'bg-orange-500' },
  { name: 'Sciences', students: 298, growth: '+7%', color: 'bg-pink-500' },
  { name: 'Arts', students: 241, growth: '+2%', color: 'bg-indigo-500' }
]

const recentActivity = [
  {
    type: 'enrollment',
    title: 'Spring 2024 enrollment reached 95% capacity',
    time: '2 hours ago',
    impact: 'high'
  },
  {
    type: 'performance',
    title: 'Computer Science department shows 15% improvement',
    time: '5 hours ago',
    impact: 'medium'
  },
  {
    type: 'system',
    title: 'New analytics dashboard deployed successfully',
    time: '1 day ago',
    impact: 'low'
  },
  {
    type: 'alert',
    title: 'Mathematics course completion rate below threshold',
    time: '2 days ago',
    impact: 'high'
  }
]

export default function AnalyticsPage() {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-600',
      green: 'from-emerald-500 to-teal-600',
      orange: 'from-orange-500 to-red-500',
      purple: 'from-purple-500 to-pink-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getBgColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-emerald-50 border-emerald-200',
      orange: 'bg-orange-50 border-orange-200',
      purple: 'bg-purple-50 border-purple-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Dashboard 📊
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Comprehensive insights and performance metrics for your institution
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <IoFilterOutline className="w-4 h-4" />
            Filters
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2">
            <IoDownloadOutline className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${getColorClasses(metric.color)}`}></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getBgColorClasses(metric.color)}`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      {metric.trend === 'up' ? (
                        <IoTrendingUpOutline className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <IoTrendingDownOutline className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`font-bold ${
                        metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wider">
                    {metric.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                </div>

                {/* Mini Chart */}
                <div className="mt-4">
                  <div className="flex items-end gap-1 h-12">
                    {metric.data.map((value, idx) => (
                      <div
                        key={idx}
                        className={`bg-gradient-to-t ${getColorClasses(metric.color)} rounded-sm flex-1 opacity-70 hover:opacity-100 transition-opacity`}
                        style={{ 
                          height: `${(value / Math.max(...metric.data)) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last 7 periods</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <IoStatsChartOutline className="w-6 h-6 text-white" />
                </div>
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${dept.color} shadow-md`}></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-600">{dept.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <IoTrendingUpOutline className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-emerald-600">{dept.growth}</span>
                      </div>
                      <p className="text-xs text-gray-500">vs last term</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl h-full">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <IoTimeOutline className="w-6 h-6 text-white" />
                </div>
                Recent Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.impact === 'high' ? 'bg-red-400' :
                        activity.impact === 'medium' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm leading-relaxed">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button variant="ghost" className="w-full">
                  <IoEyeOutline className="w-4 h-4 mr-2" />
                  View All Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-xl flex items-center justify-center">
                <IoCalendarOutline className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Class Schedules</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">98.5%</p>
              <p className="text-sm text-gray-600">Optimization Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-xl flex items-center justify-center">
                <IoTrendingUpOutline className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">94.2%</p>
              <p className="text-sm text-gray-600">Student Pass Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-xl flex items-center justify-center">
                <IoPeopleOutline className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Faculty Ratio</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">1:18</p>
              <p className="text-sm text-gray-600">Teacher to Student</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
