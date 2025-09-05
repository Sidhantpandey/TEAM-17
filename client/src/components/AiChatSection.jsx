import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { MessageCircle, Send, Bot, User, AlertTriangle, Heart, Brain } from "lucide-react";

const AiChatSection = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MindWell AI, your 24/7 mental health support companion. I'm here to listen, provide coping strategies, and guide you to appropriate resources. How are you feeling today?",
      sender: "ai",
      timestamp: "Just now"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const quickPrompts = [
    "I'm feeling anxious about exams",
    "Having trouble sleeping",
    "Feeling overwhelmed with coursework",
    "Need relaxation techniques"
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I understand you're going through a challenging time. That takes courage to share. Let me suggest some evidence-based coping strategies that might help. Would you like me to guide you through a quick breathing exercise, or would you prefer some practical study tips to manage overwhelm?",
        sender: "ai",
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <section id="ai-support" className="py-7 bg-muted/30">
      <div className="container mx-auto px-2">
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-1 py-2 rounded-full text-sm font-medium mb-1">
            <Bot className="w-4 h-4" />
            AI-Powered Support
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-elevated border-0">
              <CardHeader className="bg-gradient-wellness text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg">MindWell AI Assistant</div>
                    <div className="text-sm opacity-90">Online • Confidential • Secure</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t">
                  <div className="flex gap-2 mb-4">
                    {quickPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewMessage(prompt)}
                        className="text-xs"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message here... (completely confidential)"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features & Safety */}
          <div className="space-y-6">
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">✓</Badge>
                  <span className="text-sm">Evidence-based coping strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">✓</Badge>
                  <span className="text-sm">Crisis intervention protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">✓</Badge>
                  <span className="text-sm">Personalized wellness plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">✓</Badge>
                  <span className="text-sm">Resource recommendations</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-gentle border-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This AI is designed to provide support and guidance, but it's not a replacement for professional therapy.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Connect with Counselor
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-gentle bg-success/5 border-success">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-success" />
                  </div>
                  <h4 className="font-semibold text-success mb-2">Crisis Support</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're in immediate danger, please contact emergency services or the crisis hotline.
                  </p>
                  <Button variant="outline" size="sm" className="border-success text-success hover:bg-success hover:text-success-foreground">
                    Crisis Resources
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

export default AiChatSection;
