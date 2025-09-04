import { useState ,useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Shield, 
  Plus,
  TrendingUp,
  Clock,
  Star,
  Flag,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

const CommunitySection = ({ 
  onNavigateToChat = () => {},
  onNavigateToAppointments = () => {}
}) => {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [activeTab, setActiveTab] = useState("chatbot");

// Function to handle navigation with URL update
const handleNavigation = (route) => {
  if (route === 'chatbot') {
    // Update URL
    if (window.history && window.history.pushState) {
      window.history.pushState({ tab: 'chatbot' }, '', '/dashboard/ai-chat');
    }
    setActiveTab('chatbot');
  } else if (route === 'appointments') {
    // Update URL
    if (window.history && window.history.pushState) {
      window.history.pushState({ tab: 'appointments' }, '', '/dashboard/appointments');
    }
    setActiveTab('appointments');
  } else if (route === 'resources') {
    // Update URL
    if (window.history && window.history.pushState) {
      window.history.pushState({ tab: 'resources' }, '', '/dashboard/resources');
    }
    setActiveTab('resources');
  } else if (route === 'forum') {
    // Update URL
    if (window.history && window.history.pushState) {
      window.history.pushState({ tab: 'forum' }, '', '/dashboard/forum');
    }
    setActiveTab('forum');
  }
  // If you have a mobile menu state, uncomment the next line and define setIsMobileMenuOpen
  // setIsMobileMenuOpen(false);
};

useEffect(() => {
  const handlePopState = (event) => {
    const path = window.location.pathname;
    if (path.includes('/appointments')) {
      setActiveTab('appointments');
    } else if (path.includes('/resources')) {
      setActiveTab('resources');
    } else if (path.includes('/forum')) {
      setActiveTab('forum');
    } else {
      setActiveTab('chatbot');
    }
  };

  window.addEventListener('popstate', handlePopState);
  
  // Initialize from current pathname on mount
  const path = window.location.pathname;
  if (path.includes('/appointments')) {
    setActiveTab('appointments');
  } else if (path.includes('/resources')) {
    setActiveTab('resources');
  } else if (path.includes('/forum')) {
    setActiveTab('forum');
  } else {
    setActiveTab('chatbot');
  }

  return () => window.removeEventListener('popstate', handlePopState);
}, []);

  const topics = [
    { id: "all", name: "All Topics", count: 156 },
    { id: "anxiety", name: "Anxiety Support", count: 42 },
    { id: "depression", name: "Depression", count: 38 },
    { id: "academic", name: "Academic Stress", count: 28 },
    { id: "relationships", name: "Relationships", count: 24 },
    { id: "sleep", name: "Sleep Issues", count: 16 }
  ];

  const posts = [
    {
      id: 1,
      title: "Feeling overwhelmed with finals - anyone else?",
      author: "StudentHelper23",
      topic: "academic",
      replies: 14,
      likes: 28,
      timeAgo: "2 hours ago",
      isPopular: true,
      preview: "I'm having trouble managing my anxiety around final exams. Would love to hear how others are coping...",
      tags: ["finals", "anxiety", "study-tips"],
      needsSupport: true
    },
    {
      id: 2,
      title: "Small wins thread - share your daily victories!",
      author: "PositiveVibes",
      topic: "general",
      replies: 31,
      likes: 67,
      timeAgo: "4 hours ago",
      isPopular: true,
      preview: "Let's celebrate the small things that made us smile today. I'll start - I actually got out of bed before 10am!",
      tags: ["positivity", "daily-wins", "motivation"],
      needsSupport: false
    },
    {
      id: 3,
      title: "Meditation resources for beginners?",
      author: "MindfulStudent",
      topic: "anxiety",
      replies: 8,
      likes: 15,
      timeAgo: "6 hours ago",
      isPopular: false,
      preview: "New to meditation and looking for good apps or techniques specifically for students...",
      tags: ["meditation", "beginners", "resources"],
      needsSupport: false
    },
    {
      id: 4,
      title: "How to talk to parents about mental health",
      author: "ConcernedFreshman",
      topic: "relationships",
      replies: 22,
      likes: 34,
      timeAgo: "1 day ago",
      isPopular: true,
      preview: "My parents don't really understand mental health issues. Has anyone successfully had this conversation?",
      tags: ["family", "communication", "support"],
      needsSupport: true
    }
  ];

  const moderators = [
    {
      name: "Dr. Sarah M.",
      role: "Licensed Counselor",
      specialization: "Anxiety & Depression",
      online: true
    },
    {
      name: "Alex Chen",
      role: "Peer Volunteer",
      specialization: "Academic Stress",
      online: true
    },
    {
      name: "Jordan K.",
      role: "Peer Volunteer", 
      specialization: "LGBTQ+ Support",
      online: false
    }
  ];

  const filteredPosts = selectedTopic === "all" 
    ? posts 
    : posts.filter(post => post.topic === selectedTopic);

  return (
    <section id="community" className="py-3 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Peer Support Community
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Connect with Fellow Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our moderated peer support community where students share experiences, 
            offer support, and learn from each other in a safe environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-teal-600" />
                  </div>
                  <span>Moderated 24/7</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-600" />
                  </div>
                  <span>Be kind & supportive</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flag className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>Report inappropriate content</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Respect anonymity</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.id ? "default" : "ghost"}
                    className={`w-full justify-between ${
                      selectedTopic === topic.id 
                        ? "bg-teal-600 hover:bg-teal-700 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <span>{topic.name}</span>
                    <Badge variant="secondary" className={`ml-2 ${
                      selectedTopic === topic.id 
                        ? "bg-white/20 text-white" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {topic.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online Moderators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {moderators.map((mod, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="relative">
                      <Avatar className="w-10 h-10 bg-teal-100">
                        <AvatarFallback className="text-sm font-medium text-teal-700">
                          {mod.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        mod.online ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {mod.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {mod.role} • {mod.specialization}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Support Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Need Immediate Help?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Don't wait - get support right now
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleNavigation('chatbot')}
                    size="sm" 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Chat Now
                  </Button>
                  <Button 
                    onClick={() => handleNavigation('appointments')}
                    size="sm" 
                    variant="outline" 
                    className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">
                Recent Discussions
              </h3>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 bg-gray-100">
                          <AvatarFallback className="text-sm font-medium text-gray-700">
                            {post.author.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{post.author}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {post.timeAgo}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.needsSupport && (
                          <Badge className="bg-orange-100 text-orange-700 border-0">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Seeking Support
                          </Badge>
                        )}
                        {post.isPopular && (
                          <Badge className="bg-teal-100 text-teal-700 border-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {post.title}
                    </h4>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.preview}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {post.replies} replies
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          {post.likes} likes
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.needsSupport && (
                          <>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation('chatbot');
                              }}
                              size="sm" 
                              variant="outline" 
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              AI Support
                            </Button>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation('appointments');
                              }}
                              size="sm" 
                              variant="outline" 
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Book Session
                            </Button>
                          </>
                        )}
                        <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          Join Discussion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">Community Impact</h4>
                  <p className="text-sm opacity-90">Building connections, one conversation at a time</p>
                </div>
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-1">1,247</div>
                    <div className="text-sm opacity-90">Active Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">3,891</div>
                    <div className="text-sm opacity-90">Helpful Posts</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">98%</div>
                    <div className="text-sm opacity-90">Positive Feedback</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Resources CTA */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-teal-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Need immediate support?</h4>
                <p className="text-gray-600 mb-6">
                  Our AI chat and professional counselors are available 24/7 for immediate assistance.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => handleNavigation('chatbot')}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start AI Chat
                  </Button>
                  <Button 
                    onClick={() => handleNavigation('appointments')}
                    variant="outline" 
                    className="border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Counseling
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;