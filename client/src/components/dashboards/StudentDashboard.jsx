import { useState, useEffect, createContext, useContext } from "react";
import { motion } from "framer-motion";
import AiChatSection from "../AiChatSection";
import BookingSection from "../BookingSection";
import ResourcesSection from "../ResourcesSection";
import CommunitySection from "../CommunitySection";
import {
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Heart,
  Bot,
  UserCheck,
  Clock,
  ArrowRight,
  Menu,
  X 
} from "lucide-react";

// Router Context
const RouterContext = createContext();

// Custom Router Hook
const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
};

// Custom Router Provider
const Router = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.hash);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, replace = false) => {
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method](null, '', path);
    setCurrentPath(path);
  };

  const value = {
    currentPath,
    navigate
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

// Custom Link Component
const Link = ({ to, className, children, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

// Route matching function
const matchPath = (pattern, pathname) => {
  // Simple pattern matching - can be extended for more complex patterns
  if (pattern === pathname) return { isExact: true };
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2);
    return pathname.startsWith(basePath) ? { isExact: false } : null;
  }
  return null;
};

// Custom Routes Component
const Routes = ({ children }) => {
  const { currentPath } = useRouter();
  
  for (const child of children) {
    const match = matchPath(child.props.path, currentPath);
    if (match) {
      return child.props.element;
    }
  }
  return null;
};

// Custom Route Component
const Route = ({ path, element }) => null; // This is just a placeholder, Routes handles the rendering

// Navigate Component for redirects
const Navigate = ({ to, replace = false }) => {
  const { navigate } = useRouter();
  
  useEffect(() => {
    navigate(to, replace);
  }, [to, replace, navigate]);
  
  return null;
};

// AI Chat Component
const AiChatSectioncomp = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <AiChatSection />
    </div>
  );
};

// Appointments Component
const AppointmentsSectioncomp = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <BookingSection />
    </div>
  );
};

// Resources Component
const ResourcesSectioncomp = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <ResourcesSection />
    </div>
  );
};

// Forum Component
const ForumSectioncomp = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <CommunitySection />
    </div>
  );
};

// Dashboard Layout Component
const DashboardLayout = ({ user, onLogout }) => {
  const { currentPath, navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current active tab from URL
  const getActiveTab = () => {
    const path = currentPath;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/forum')) return 'forum';
    return 'chatbot';
  };

  const activeTab = getActiveTab();

  // Route handling function
  const handleRouteChange = (tabId) => {
    setIsMobileMenuOpen(false); // Close mobile menu when switching tabs
    
    switch (tabId) {
      case 'appointments':
        navigate('/dashboard/appointments');
        break;
      case 'resources':
        navigate('/dashboard/resources');
        break;
      case 'forum':
        navigate('/dashboard/forum');
        break;
      default:
        navigate('/dashboard/ai-chat');
    }
  };

  const tabs = [
    {
      id: "chatbot",
      label: "AI Support",
      icon: MessageCircle,
      description: "24/7 AI-powered mental health support",
      path: "/dashboard/ai-chat"
    },
    {
      id: "appointments",
      label: "Counseling",
      icon: Calendar,
      description: "Book sessions with licensed counselors",
      path: "/dashboard/appointments"
    },
    {
      id: "resources",
      label: "Resources",
      icon: BookOpen,
      description: "Mental health tools and guides",
      path: "/dashboard/resources"
    },
    { 
      id: "forum", 
      label: "Peer Forum", 
      icon: Users,
      description: "Connect with fellow students",
      path: "/dashboard/forum"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Brand */}
            <Link to="/dashboard/ai-chat" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MindCare</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                24/7 Support Available
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>

              <Link 
                to="/dashboard/ai-chat"
                className="bg-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white/90"
            >
              <div className="px-4 py-4 space-y-3">
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  24/7 Support Available
                </div>
                <Link 
                  to="/dashboard/ai-chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors block text-center"
                >
                  Get Started
                </Link>
                
                {/* Mobile Navigation Links */}
                <div className="border-t border-gray-200 pt-3">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.id}
                      to={tab.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Top Navigation Tabs */}
          <div className="border-t border-gray-100">
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.div key={tab.id}>
                  <Link
                    to={tab.path}
                    className={`flex-shrink-0 py-4 px-6 font-medium text-sm flex items-center transition-all duration-200 border-b-3 block ${
                      activeTab === tab.id
                        ? "border-teal-500 text-teal-600 bg-teal-50/50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    <tab.icon
                      className={`h-5 w-5 mr-3 ${
                        activeTab === tab.id
                          ? "text-teal-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="text-left">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {tab.description}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show on chatbot tab */}
      {activeTab === 'chatbot' && (
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Your Mental Health <br />
                <span className="text-teal-200">Matters</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
              >
                Comprehensive digital mental health support designed specifically for students. 
                Get AI-guided support, book confidential sessions, access resources, and connect 
                with your peers in a safe, supportive environment.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link 
                  to="/dashboard/ai-chat"
                  className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center text-lg"
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Start AI Chat
                </Link>
                <Link 
                  to="/dashboard/appointments"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-teal-600 transition-colors flex items-center text-lg"
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Book Counseling
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section - Only show on chatbot tab */}
      {activeTab === 'chatbot' && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">AI Support</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <div className="text-4xl font-bold text-teal-600 mb-2">100%</div>
                <div className="text-gray-600 font-medium">Confidential</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <div className="text-4xl font-bold text-teal-600 mb-2">Free</div>
                <div className="text-gray-600 font-medium">For Students</div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center text-sm text-gray-600">
            <Link 
              to="/dashboard/ai-chat"
              className="hover:text-teal-600 transition-colors"
            >
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span className="text-teal-600 font-medium">
              {tabs.find(tab => tab.id === activeTab)?.label || 'AI Support'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Routes>
            <Route path="/dashboard/ai-chat" element={<AiChatSectioncomp />} />
            <Route path="/dashboard/appointments" element={<AppointmentsSectioncomp />} />
            <Route path="/dashboard/resources" element={<ResourcesSectioncomp />} />
            <Route path="/dashboard/forum" element={<ForumSectioncomp />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/ai-chat" replace />} />
            <Route path="/" element={<Navigate to="/dashboard/ai-chat" replace />} />
          </Routes>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 MindCare. Your mental health matters. All sessions are confidential.</p>
            <div className="flex justify-center items-center mt-2">
              <UserCheck className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-green-600 font-medium">Counselor Available</span>
              <div className="mx-4 w-1 h-1 bg-gray-300 rounded-full"></div>
              <Bot className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-blue-600 font-medium">AI Chat Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component with Router
const StudentDashboard = ({
  user = { name: "Student" },
  onLogout = () => {},
}) => {
  return (
    <Router>
      <DashboardLayout user={user} onLogout={onLogout} />
    </Router>
  );
};

export default StudentDashboard;