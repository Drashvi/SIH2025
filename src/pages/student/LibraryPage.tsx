import { motion } from 'framer-motion'
import { 
  IoLibraryOutline, 
  IoBookOutline, 
  IoSearchOutline, 
  IoDownloadOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoStarOutline,
  IoFilterOutline,
  IoGridOutline,
  IoListOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../../components/ui'

// Mock data for library resources
const resources = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    type: 'E-Book',
    subject: 'Computer Science',
    rating: 4.8,
    downloads: 1250,
    size: '15.2 MB',
    format: 'PDF',
    description: 'Comprehensive guide to algorithms and data structures',
    thumbnail: '📚',
    isAvailable: true
  },
  {
    id: 2,
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    type: 'E-Book',
    subject: 'Database Systems',
    rating: 4.6,
    downloads: 980,
    size: '22.1 MB',
    format: 'PDF',
    description: 'Fundamental concepts of database systems and design',
    thumbnail: '📖',
    isAvailable: true
  },
  {
    id: 3,
    title: 'Software Engineering Principles',
    author: 'Ian Sommerville',
    type: 'E-Book',
    subject: 'Software Engineering',
    rating: 4.7,
    downloads: 1100,
    size: '18.5 MB',
    format: 'PDF',
    description: 'Modern software engineering practices and methodologies',
    thumbnail: '💻',
    isAvailable: true
  },
  {
    id: 4,
    title: 'Data Structures and Algorithms in Java',
    author: 'Robert Lafore',
    type: 'E-Book',
    subject: 'Programming',
    rating: 4.5,
    downloads: 850,
    size: '12.8 MB',
    format: 'PDF',
    description: 'Java implementation of common data structures and algorithms',
    thumbnail: '☕',
    isAvailable: false
  },
  {
    id: 5,
    title: 'Mathematics for Computer Science',
    author: 'Eric Lehman',
    type: 'E-Book',
    subject: 'Mathematics',
    rating: 4.4,
    downloads: 720,
    size: '20.3 MB',
    format: 'PDF',
    description: 'Mathematical foundations for computer science students',
    thumbnail: '🔢',
    isAvailable: true
  },
  {
    id: 6,
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    type: 'E-Book',
    subject: 'Operating Systems',
    rating: 4.6,
    downloads: 950,
    size: '25.7 MB',
    format: 'PDF',
    description: 'Comprehensive coverage of operating system principles',
    thumbnail: '⚙️',
    isAvailable: true
  }
]

const categories = [
  { name: 'All Resources', count: resources.length, icon: IoLibraryOutline },
  { name: 'Computer Science', count: 3, icon: IoBookOutline },
  { name: 'Mathematics', count: 1, icon: IoBookOutline },
  { name: 'Programming', count: 1, icon: IoBookOutline },
  { name: 'Operating Systems', count: 1, icon: IoBookOutline }
]

const recentDownloads = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    downloadedAt: '2 hours ago',
    size: '15.2 MB'
  },
  {
    id: 2,
    title: 'Database System Concepts',
    downloadedAt: '1 day ago',
    size: '22.1 MB'
  },
  {
    id: 3,
    title: 'Software Engineering Principles',
    downloadedAt: '3 days ago',
    size: '18.5 MB'
  }
]

export default function LibraryPage() {
  const totalResources = resources.length
  const availableResources = resources.filter(r => r.isAvailable).length
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-600">
            Digital Library
          </h1>
          <p className="text-gray-600 mt-2">
            Access e-books, research papers, and study materials
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoFilterOutline className="w-5 h-5 mr-2" />
            Filter
          </Button>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            <IoSearchOutline className="w-5 h-5 mr-2" />
            Advanced Search
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoLibraryOutline className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoBookOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoDownloadOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <IoTimeOutline className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{recentDownloads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-purple-50"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <category.icon className="w-5 h-5 text-purple-600" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.count} resources</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Downloads */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDownloads.map((download, index) => (
                  <motion.div
                    key={download.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900 text-sm">{download.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{download.downloadedAt}</span>
                      <span>•</span>
                      <span>{download.size}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Input placeholder="Search resources..." className="w-80" />
              <Button variant="outline" size="sm">
                <IoSearchOutline className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <IoGridOutline className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <IoListOutline className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader className="bg-purple-50 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{resource.thumbnail}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                          <p className="text-sm text-gray-600">👨‍💼 {resource.author}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resource.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {resource.isAvailable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <IoBookOutline className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{resource.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IoDownloadOutline className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{resource.downloads} downloads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IoTimeOutline className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{resource.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IoStarOutline className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">{resource.rating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          disabled={!resource.isAvailable}
                        >
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          disabled={!resource.isAvailable}
                        >
                          <IoDownloadOutline className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
