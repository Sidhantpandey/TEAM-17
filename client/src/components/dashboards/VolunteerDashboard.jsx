import { useState } from 'react';
import logo from "../../assets/logo.png"
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
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Activity,
  Heart
} from 'lucide-react';

const VolunteerDashboard = ({ user = { name: 'Alex Chen' }, onLogout = () => {} }) => {
  const [activeTab, setActiveTab] = useState('moderation');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // State for reports with full CRUD operations
  const [reportedPosts, setReportedPosts] = useState([
    {
      id: 1,
      content: 'I\'ve been feeling really overwhelmed with studies lately and don\'t know how to cope. Everything feels impossible...',
      author: 'Anonymous Student #2847',
      reason: 'Self-harm concern',
      time: '2 hours ago',
      status: 'pending',
      priority: 'high',
      reportedBy: 'Community Member',
      category: 'Mental Health Crisis'
    },
    {
      id: 2,
      content: 'Does anyone have tips for dealing with anxiety during presentations? I get so nervous I can barely speak.',
      author: 'Anonymous Student #1923',
      reason: 'Spam/Off-topic',
      time: '5 hours ago',
      status: 'pending',
      priority: 'low',
      reportedBy: 'Auto-Detection',
      category: 'Anxiety Support'
    },
    {
      id: 3,
      content: 'Check out this amazing study technique that helped me ace my exams! Link: suspicious-link.com',
      author: 'Anonymous Student #4521',
      reason: 'Suspicious links',
      time: '1 day ago',
      status: 'pending',
      priority: 'medium',
      reportedBy: 'Moderator Alert',
      category: 'Academic'
    }
  ]);

  // State for recent posts
  const [recentPosts, setRecentPosts] = useState([
    {
      id: 1,
      title: 'Managing exam anxiety - techniques that work',
      content: 'I wanted to share some evidence-based techniques that have helped me manage anxiety during exam periods...',
      author: 'Anonymous Student #1847',
      replies: 12,
      likes: 45,
      time: '2 hours ago',
      status: 'approved',
      category: 'Anxiety Support',
      engagement: 'high'
    },
    {
      id: 2,
      title: 'Self-care tips during stressful periods',
      content: 'Here are some simple self-care practices that don\'t take much time but make a huge difference...',
      author: 'Anonymous Student #9823',
      replies: 8,
      likes: 32,
      time: '5 hours ago',
      status: 'approved',
      category: 'Self-Care',
      engagement: 'medium'
    },
    {
      id: 3,
      title: 'Finding motivation when everything feels pointless',
      content: 'Sometimes I struggle to find motivation to do anything. What helps you get through tough days?',
      author: 'Anonymous Student #5647',
      replies: 23,
      likes: 67,
      time: '1 day ago',
      status: 'approved',
      category: 'Depression Support',
      engagement: 'high'
    }
  ]);

  // Statistics state
  const [stats, setStats] = useState({
    pendingReports: reportedPosts.filter(p => p.status === 'pending').length,
    postsModeratedToday: 8,
    communityHealthScore: 94,
    weeklyApprovals: 47,
    weeklyRemovals: 3,
    monthlyReviews: 12
  });

  const tabs = [
    { id: 'moderation', label: 'Moderation Queue', icon: Shield },
    { id: 'posts', label: 'Recent Posts', icon: MessageSquare },
    { id: 'reports', label: 'Analytics', icon: TrendingUp },
  ];

  // Moderation actions
  const handleApprovePost = (postId) => {
    setReportedPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: 'approved' }
        : post
    ));
    setStats(prev => ({ 
      ...prev, 
      pendingReports: prev.pendingReports - 1,
      weeklyApprovals: prev.weeklyApprovals + 1 
    }));
  };

  const handleRemovePost = (postId) => {
    setReportedPosts(prev => prev.filter(post => post.id !== postId));
    setStats(prev => ({ 
      ...prev, 
      pendingReports: prev.pendingReports - 1,
      weeklyRemovals: prev.weeklyRemovals + 1 
    }));
  };

  const handleReviewPost = (postId) => {
    setReportedPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: 'under_review' }
        : post
    ));
  };

  // Filter functions
  const filteredReports = reportedPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredPosts = recentPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'removed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'moderation':
        return (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>

            {/* Moderation Queue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Moderation Queue</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Last updated: 5 min ago
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-sm font-medium mb-1">Volunteer Moderator Guidelines</p>
                    <p className="text-blue-700 text-sm">
                      You have limited moderation rights focused on community safety. You cannot access private student data or counselling records. 
                      Always prioritize student wellbeing and escalate serious concerns immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {filteredReports.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(post.priority)}`}>
                          {post.priority.toUpperCase()} PRIORITY
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">{post.reason}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {post.time}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 text-sm leading-relaxed">"{post.content}"</p>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">Author: {post.author}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Category: {post.category}</span>
                          <span>•</span>
                          <span>Reported by: {post.reportedBy}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleApprovePost(post.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Post
                      </button>
                      <button 
                        onClick={() => handleRemovePost(post.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Post
                      </button>
                      <button 
                        onClick={() => handleReviewPost(post.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Mark for Review
                      </button>
                    </div>
                  </div>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h4>
                    <p className="text-gray-600">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Great job! The community is peaceful today.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recent posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Forum Posts</h3>
              
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h4>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                            {post.category}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {post.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 text-sm leading-relaxed">"{post.content}"</p>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-6 text-gray-600">
                        <span>By {post.author}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {post.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes} likes
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.time}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        post.engagement === 'high' ? 'bg-green-100 text-green-800' :
                        post.engagement === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.engagement} engagement
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h4>
                    <p className="text-gray-600">Try adjusting your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Moderation Analytics</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { type: 'Posts Approved', count: stats.weeklyApprovals, period: 'This Week', trend: '+12%', color: 'bg-green-500' },
                  { type: 'Content Removed', count: stats.weeklyRemovals, period: 'This Week', trend: '-5%', color: 'bg-red-500' },
                  { type: 'Reports Reviewed', count: stats.monthlyReviews, period: 'This Month', trend: '+8%', color: 'bg-blue-500' },
                ].map((report, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center`}>
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        report.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {report.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{report.count}</div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{report.type}</div>
                    <div className="text-sm text-gray-600">{report.period}</div>
                  </div>
                ))}
              </div>

              {/* Weekly Activity Chart Placeholder */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity Overview</h4>
                <div className="h-64 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                    <p className="text-gray-600">Activity chart visualization would go here</p>
                    <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
                  </div>
                </div>
              </div>
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
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <img src={logo} alt="" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Volunteer Moderator • Active
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.pendingReports}
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            { 
              label: 'Pending Reports', 
              value: stats.pendingReports, 
              color: 'from-red-500 to-red-600',
              icon: AlertTriangle,
              trend: stats.pendingReports > 5 ? 'High' : 'Normal'
            },
            { 
              label: 'Posts Moderated Today', 
              value: stats.postsModeratedToday, 
              color: 'from-green-500 to-green-600',
              icon: CheckCircle,
              trend: '+15% vs yesterday'
            },
            { 
              label: 'Community Health Score', 
              value: `${stats.communityHealthScore}%`, 
              color: 'from-blue-500 to-blue-600',
              icon: Heart,
              trend: 'Excellent'
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-900 mb-2">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Flag className="h-4 w-4 mr-2" />
                    View All Reports
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Users className="h-4 w-4 mr-2" />
                    Community Guidelines
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;