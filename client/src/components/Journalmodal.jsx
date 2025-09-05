import React, { useState } from 'react';
import { Heart, Send, Users, Shield, MessageCircle, ThumbsUp } from 'lucide-react';

const AnonymousSharingComponent = () => {
  const [activeTab, setActiveTab] = useState('share');
  const [incident, setIncident] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      incident: "I failed my midterm exam and I'm terrified to tell my parents. The anxiety is keeping me awake at night and I can't focus on studying for my remaining exams.",
      timeAgo: "3 hours ago",
      supportCount: 12,
      responses: 5,
      supportMessages: [
        "You're not alone in this. One exam doesn't define your worth or your future. Take it one step at a time. 💙",
        "I've been there too. Your mental health matters more than grades. Consider talking to a counselor about managing this anxiety.",
        "Failure is a stepping stone to success. Every successful person has failed at something. You've got this! 🌟"
      ]
    },
    {
      id: 2,
      incident: "My roommate is constantly loud and inconsiderate. I've tried talking to them but nothing changes. I feel anxious about going back to my dorm room, which should be my safe space.",
      timeAgo: "6 hours ago",
      supportCount: 8,
      responses: 3,
      supportMessages: [
        "Living situations can be really challenging. Have you considered talking to your RA? They might be able to help mediate.",
        "Your peace of mind matters. Sometimes we need to advocate firmly for ourselves. You deserve a comfortable living space."
      ]
    }
  ]);

  const handleShareIncident = () => {
    if (incident.trim()) {
      const newPost = {
        id: posts.length + 1,
        incident: incident,
        timeAgo: "Just now",
        supportCount: 0,
        responses: 0,
        supportMessages: []
      };
      setPosts([newPost, ...posts]);
      setIncident('');
      setActiveTab('community');
    }
  };

  const handleSendSupport = (postId) => {
    if (supportMessage.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            supportMessages: [...post.supportMessages, supportMessage],
            supportCount: post.supportCount + 1,
            responses: post.responses + 1
          };
        }
        return post;
      }));
      setSupportMessage('');
    }
  };

  const giveSupportHeart = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          supportCount: post.supportCount + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Safe Space Sharing</h2>
            <p className="text-sm text-gray-600">Share anonymously, support authentically</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          This is a judgment-free zone where students can share what's causing them anxiety and receive warmth from the community. All posts are completely anonymous.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('share')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === 'share' 
              ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Share Your Story
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === 'community' 
              ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Community Support
        </button>
      </div>

      {/* Share Tab */}
      {activeTab === 'share' && (
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-1">Remember</h3>
                <p className="text-sm text-blue-700">
                  Your identity is completely protected. Share what's weighing on your heart - anxiety, stress, or any situation that's troubling you. Our community is here to support you.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's causing you anxiety or stress?
              </label>
              <textarea
                value={incident}
                onChange={(e) => setIncident(e.target.value)}
                placeholder="Share your situation... Whether it's academic pressure, relationship issues, family problems, or anything else that's making you feel anxious or overwhelmed. Your story matters and you're not alone."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleShareIncident}
              disabled={!incident.trim()}
              className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Share Anonymously
            </button>
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-teal-500" />
              <h3 className="text-lg font-medium text-gray-800">Community Stories</h3>
            </div>
            <p className="text-sm text-gray-600">
              Read what others are going through and offer your support. Small acts of kindness make a big difference.
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed mb-3">{post.incident}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.timeAgo}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.supportCount} support
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.responses} responses
                    </span>
                  </div>
                </div>

                {/* Support Messages */}
                {post.supportMessages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {post.supportMessages.map((message, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border-l-4 border-teal-300">
                        <p className="text-sm text-gray-700">{message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Support Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => giveSupportHeart(post.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Send Love
                  </button>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Send a supportive message..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleSendSupport(post.id)}
                      disabled={!supportMessage.trim()}
                      className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No stories shared yet. Be the first to share and support others.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnonymousSharingComponent;