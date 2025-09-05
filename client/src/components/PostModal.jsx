import { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  X, 
  AlertCircle, 
  Users, 
  MessageCircle, 
  Calendar,
  Eye,
  EyeOff,
  Hash,
  BookOpen
} from "lucide-react";

const PostModal = ({ 
  isOpen, 
  onClose, 
  topics = [], 
  onSubmit = () => {},
  onNavigateToChat = () => {},
  onNavigateToAppointments = () => {}
}) => {
  const [formData, setFormData] = useState({
    topic: '',
    title: '',
    content: '',
    tags: '',
    seekingSupport: false,
    anonymous: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.topic) {
      newErrors.topic = 'Please select a topic category';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Post title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Post content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters long';
    } else if (formData.content.length > 2000) {
      newErrors.content = 'Content must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Process tags
      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Limit to 5 tags

      const postData = {
        ...formData,
        tags: processedTags,
        timestamp: new Date().toISOString(),
        id: Date.now() // In real app, this would come from backend
      };

      await onSubmit(postData);
      
      // Reset form
      setFormData({
        topic: '',
        title: '',
        content: '',
        tags: '',
        seekingSupport: false,
        anonymous: false
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        topic: '',
        title: '',
        content: '',
        tags: '',
        seekingSupport: false,
        anonymous: false
      });
      setErrors({});
      setShowPreview(false);
      onClose();
    }
  };

  // Get selected topic info
  const selectedTopicInfo = topics.find(topic => topic.id === formData.topic);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
              <p className="text-sm text-gray-600 mt-1">
                Share your thoughts and connect with the community
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-gray-600 hover:text-gray-800"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {!showPreview ? (
            // Form View
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Category *
                  </label>
                  <select 
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.topic ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a topic...</option>
                    {topics.filter(topic => topic.id !== "all").map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name} ({topic.count} posts)
                      </option>
                    ))}
                  </select>
                  {errors.topic && (
                    <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
                  )}
                </div>

                {/* Post Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="What's on your mind? Be specific and descriptive..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title ? (
                      <p className="text-red-500 text-sm">{errors.title}</p>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Make your title clear and specific to get better responses
                      </p>
                    )}
                    <span className="text-xs text-gray-400">
                      {formData.title.length}/200
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={8}
                    placeholder="Share your thoughts, experiences, or questions with the community. Be honest and specific - the more details you provide, the better support you'll receive..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                      errors.content ? 'border-red-300' : 'border-gray-300'
                    }`}
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.content ? (
                      <p className="text-red-500 text-sm">{errors.content}</p>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Share your experience - others have likely felt the same way
                      </p>
                    )}
                    <span className="text-xs text-gray-400">
                      {formData.content.length}/2000
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="anxiety, study-tips, support, finals, relationships"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    <Hash className="w-3 h-3 inline mr-1" />
                    Separate tags with commas (max 5 tags)
                  </p>
                </div>

                {/* Support Options */}
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.seekingSupport}
                        onChange={(e) => handleInputChange('seekingSupport', e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 mt-0.5" 
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          I'm seeking support and resources
                        </span>
                        <span className="text-xs text-gray-600">
                          This will highlight your post and connect you with additional resources
                        </span>
                      </div>
                    </label>
                    {formData.seekingSupport && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-700 mb-3">
                          <AlertCircle className="w-4 h-4 inline mr-1 text-orange-600" />
                          Immediate support options available:
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={onNavigateToChat}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            AI Chat Now
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={onNavigateToAppointments}
                            className="border-green-200 text-green-700 hover:bg-green-50 text-xs"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Book Session
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.anonymous}
                        onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 mt-0.5" 
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          Post anonymously
                        </span>
                        <span className="text-xs text-gray-600">
                          Your username will be hidden, but moderators can still see your identity
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            // Preview View
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-3xl mx-auto">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Post Preview
                </h4>
                
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    {/* Preview Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formData.anonymous ? 'Anonymous User' : 'You'}
                          </div>
                          <div className="text-sm text-gray-500">Just now</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedTopicInfo && (
                          <Badge variant="outline" className="text-xs">
                            {selectedTopicInfo.name}
                          </Badge>
                        )}
                        {formData.seekingSupport && (
                          <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Seeking Support
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {formData.title || 'Your post title will appear here...'}
                      </h4>
                      
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {formData.content || 'Your post content will appear here...'}
                      </div>

                      {formData.tags && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.split(',').map((tag, index) => {
                            const trimmedTag = tag.trim();
                            if (!trimmedTag) return null;
                            return (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{trimmedTag}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Preview Footer */}
                    <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>0 replies</span>
                        <span>0 likes</span>
                      </div>
                      <Button variant="outline" size="sm" className="border-teal-200 text-teal-700">
                        Join Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Posts are moderated to ensure a safe and supportive environment
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.topic}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Posting...
                  </>
                ) : (
                  'Post to Community'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
