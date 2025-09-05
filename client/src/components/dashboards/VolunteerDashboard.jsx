import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MessageSquare, 
  Flag, 
  LogOut,
  Bell,
  Settings,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const VolunteerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('moderation');

  const tabs = [
    { id: 'moderation', label: 'Forum Moderation', icon: Shield },
    { id: 'posts', label: 'Recent Posts', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: Flag },
  ];

  const reportedPosts = [
    {
      id: 1,
      content: 'I\'ve been feeling really overwhelmed with studies lately...',
      author: 'Anonymous',
      reason: 'Inappropriate content',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      content: 'Does anyone have tips for dealing with anxiety during presentations?',
      author: 'Anonymous',
      reason: 'Spam',
      time: '5 hours ago',
      status: 'pending'
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Managing exam anxiety',
      content: 'I wanted to share some techniques that have helped me...',
      author: 'Anonymous',
      replies: 12,
      time: '2 hours ago',
      status: 'approved'
    },
    {
      id: 2,
      title: 'Self-care tips during stressful periods',
      content: 'Here are some simple self-care practices...',
      author: 'Anonymous',
      replies: 8,
      time: '5 hours ago',
      status: 'approved'
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'moderation':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Moderation Queue</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-blue-800 text-sm">
                  You have limited moderation rights. You cannot access private student data or counselling records.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {reportedPosts.map((post) => (
                <div key={post.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-red-800">Reported: {post.reason}</span>
                      </div>
                      <p className="text-gray-700 text-sm italic">"{post.content}"</p>
                      <p className="text-xs text-gray-500 mt-2">By {post.author} • {post.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Forum Posts</h3>
            
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-gray-700 text-sm mb-3">"{post.content}"</p>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>By {post.author} • {post.replies} replies • {post.time}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Moderation Reports</h3>
            
            <div className="grid gap-4">
              {[
                { type: 'Content Removed', count: 3, period: 'This Week' },
                { type: 'Posts Approved', count: 47, period: 'This Week' },
                { type: 'Reports Reviewed', count: 12, period: 'This Month' },
              ].map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{report.type}</h4>
                      <p className="text-sm text-gray-600">{report.period}</p>
                    </div>
                    <div className="text-2xl font-bold text-primary-600">{report.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Welcome, {user.name}</h1>
                <p className="text-sm text-gray-600">Volunteer Moderator</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Pending Reports', value: '2', color: 'bg-red-500' },
            { label: 'Posts Moderated Today', value: '8', color: 'bg-green-500' },
            { label: 'Community Health Score', value: '94%', color: 'bg-blue-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;