import { motion } from 'framer-motion'
import { 
  IoChatboxOutline, 
  IoPersonOutline, 
  IoTimeOutline, 
  IoMailOutline,
  IoAddOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoEllipsisVerticalOutline,
  IoCheckmarkDoneOutline,
  IoCheckmarkOutline
} from 'react-icons/io5'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../../components/ui'

// Mock data for messages
const conversations = [
  {
    id: 1,
    name: 'Dr. Smith',
    role: 'Instructor',
    course: 'Data Structures',
    lastMessage: 'Please submit your assignment by tomorrow.',
    timestamp: '2 hours ago',
    unread: 2,
    avatar: '👨‍🏫',
    online: true
  },
  {
    id: 2,
    name: 'Prof. Johnson',
    role: 'Instructor',
    course: 'Database Systems',
    lastMessage: 'Great work on the project presentation!',
    timestamp: '1 day ago',
    unread: 0,
    avatar: '👨‍🏫',
    online: false
  },
  {
    id: 3,
    name: 'Dr. Williams',
    role: 'Instructor',
    course: 'Software Engineering',
    lastMessage: 'The team meeting is scheduled for Friday.',
    timestamp: '2 days ago',
    unread: 1,
    avatar: '👨‍🏫',
    online: true
  },
  {
    id: 4,
    name: 'Alex Johnson',
    role: 'Student',
    course: 'Study Group',
    lastMessage: 'Can you share the notes from yesterday\'s class?',
    timestamp: '3 days ago',
    unread: 0,
    avatar: '👨‍🎓',
    online: false
  }
]

const recentMessages = [
  {
    id: 1,
    sender: 'Dr. Smith',
    message: 'Please submit your assignment by tomorrow. Make sure to include all the required documentation.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'received'
  },
  {
    id: 2,
    sender: 'You',
    message: 'I\'ll submit it by tonight. Working on the final documentation now.',
    timestamp: '1 hour ago',
    isRead: true,
    type: 'sent'
  },
  {
    id: 3,
    sender: 'Dr. Smith',
    message: 'Perfect! Let me know if you need any clarification.',
    timestamp: '30 minutes ago',
    isRead: false,
    type: 'received'
  }
]

export default function MessagesPage() {
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0)

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
          <h1 className="text-3xl font-bold text-pink-600">
            Messages
          </h1>
          <p className="text-gray-600 mt-2">
            Communicate with instructors and fellow students
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <IoFilterOutline className="w-5 h-5 mr-2" />
            Filter
          </Button>
          <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
            <IoAddOutline className="w-5 h-5 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <IoChatboxOutline className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <IoMailOutline className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{totalUnread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoPersonOutline className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Online Contacts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.filter(conv => conv.online).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoTimeOutline className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="bg-pink-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button size="sm" variant="outline">
                  <IoSearchOutline className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-3">
                <Input placeholder="Search conversations..." className="w-full" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-xl">
                          {conversation.avatar}
                        </div>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.course}</p>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-pink-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-lg">
                    👨‍🏫
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. Smith</h3>
                    <p className="text-sm text-gray-600">Data Structures • Online</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <IoEllipsisVerticalOutline className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      message.type === 'sent' 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center gap-1 mt-2 text-xs ${
                        message.type === 'sent' ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp}</span>
                        {message.type === 'sent' && (
                          message.isRead ? (
                            <IoCheckmarkDoneOutline className="w-3 h-3" />
                          ) : (
                            <IoCheckmarkOutline className="w-3 h-3" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1"
                />
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoChatboxOutline className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <IoMailOutline className="w-6 h-6" />
              <span>Contact Instructor</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <IoPersonOutline className="w-6 h-6" />
              <span>Study Group Chat</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <IoChatboxOutline className="w-6 h-6" />
              <span>General Discussion</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
