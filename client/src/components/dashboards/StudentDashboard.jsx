import { useState } from "react";
import { motion } from "framer-motion";
import AiChatSection from "../AiChatSection";
import {
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  LogOut,
  Bell,
  Settings,
  Send,
  Bot,
  User,
} from "lucide-react";

// AI Chat Component
const AiChatSectioncomp = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to support you. How are you feeling today?",
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I understand how you're feeling. That's completely normal and you're not alone in this.",
        "It sounds like you're going through a challenging time. Would you like to talk about what's been on your mind?",
        "Thank you for sharing that with me. Have you tried any coping strategies that have helped before?",
        "Your feelings are valid. Sometimes it helps to break things down into smaller, manageable steps.",
      ];

      const botMessage = {
        id: Date.now() + 1,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
      };

      setChatMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <AiChatSection />
    </div>
  );
};

// Appointments Component
const AppointmentsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Calendar className="h-6 w-6 mr-2 text-primary-600" />
        Your Appointments
      </h3>

      <div className="grid gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">Dr. Sarah Wilson</h4>
              <p className="text-sm text-gray-600">
                Licensed Clinical Psychologist
              </p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Confirmed
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Tomorrow, 2:00 PM - 3:00 PM
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">Dr. Michael Chen</h4>
              <p className="text-sm text-gray-600">Counseling Psychologist</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Pending
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Next Monday, 10:00 AM - 11:00 AM
          </div>
        </div>
      </div>

      <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
        Book New Appointment
      </button>
    </div>
  );
};

// Resources Component
const ResourcesSection = () => {
  const resources = [
    {
      title: "Managing Stress",
      type: "Article",
      time: "5 min read",
      category: "Stress",
    },
    {
      title: "Breathing Exercises",
      type: "Video",
      time: "10 min",
      category: "Anxiety",
    },
    {
      title: "Sleep Hygiene Guide",
      type: "PDF",
      time: "8 min read",
      category: "Sleep",
    },
    {
      title: "Mindfulness Meditation",
      type: "Audio",
      time: "15 min",
      category: "Mindfulness",
    },
    {
      title: "Building Resilience",
      type: "Article",
      time: "7 min read",
      category: "Mental Health",
    },
    {
      title: "Time Management Tips",
      type: "Video",
      time: "12 min",
      category: "Productivity",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <BookOpen className="h-6 w-6 mr-2 text-primary-600" />
        Mental Health Resources
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {resource.type} • {resource.time}
                </p>
              </div>
              <div className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                {resource.category}
              </div>
            </div>
            <div className="mt-3">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Resource →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Forum Component
const ForumSection = () => {
  const posts = [
    {
      title: "Managing exam anxiety - tips that actually work",
      author: "Anonymous Student",
      replies: 12,
      time: "2 hours ago",
      category: "Academic Stress",
    },
    {
      title: "Self-care tips during stressful periods",
      author: "Anonymous Helper",
      replies: 8,
      time: "5 hours ago",
      category: "Self Care",
    },
    {
      title: "Finding balance in daily routine",
      author: "Anonymous Peer",
      replies: 15,
      time: "1 day ago",
      category: "Life Balance",
    },
    {
      title: "Dealing with social anxiety on campus",
      author: "Anonymous Student",
      replies: 6,
      time: "2 days ago",
      category: "Social Anxiety",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Users className="h-6 w-6 mr-2 text-primary-600" />
        Peer Support Forum
      </h3>

      <div className="space-y-4 mb-6">
        {posts.map((post, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 flex-1">
                {post.title}
              </h4>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium ml-3">
                {post.category}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                By {post.author} • {post.replies} replies
              </span>
              <span>{post.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
        Start New Discussion
      </button>
    </div>
  );
};

// Main Dashboard Component
const StudentDashboard = ({
  user = { name: "Student" },
  onLogout = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("chatbot");

  const tabs = [
    {
      id: "chatbot",
      label: "AI Support",
      icon: MessageCircle,
      component: AiChatSectioncomp,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      component: AppointmentsSection,
    },
    {
      id: "resources",
      label: "Resources",
      icon: BookOpen,
      component: ResourcesSection,
    },
    { id: "forum", label: "Peer Forum", icon: Users, component: ForumSection },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || AiChatSectioncomp;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Welcome back, {user.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Student Mental Health Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Top Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon
                    className={`h-5 w-5 mr-2 ${
                      activeTab === tab.id
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ActiveComponent />
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;
