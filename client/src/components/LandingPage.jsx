import { motion } from 'framer-motion';
import { Heart, Shield, Users, Brain, ArrowRight, Star, MessageCircle, Calendar, CheckCircle } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Support',
      description: 'Get instant mental health support through our intelligent chatbot available 24/7.',
    },
    {
      icon: Users,
      title: 'Professional Counselling',
      description: 'Book appointments with qualified mental health professionals at your convenience.',
    },
    {
      icon: Heart,
      title: 'Peer Community',
      description: 'Connect with others in a safe, moderated environment for mutual support.',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data is protected with enterprise-grade security and complete confidentiality.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'University Student',
      content: 'This platform helped me through my anxiety during exam period. The chatbot was always there when I needed it.',
      rating: 5,
    },
    {
      name: 'Dr. Michael Torres',
      role: 'Licensed Counsellor',
      content: 'As a mental health professional, I appreciate how this system streamlines my practice while maintaining security.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Peer Volunteer',
      content: 'Being able to help others while maintaining appropriate boundaries has been incredibly rewarding.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      {/* Navigation */}
      <motion.nav 
        className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-teal-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">MindCare</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-xl hover:bg-teal-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                24/7 Support Available
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Your Mental Health
                <span className="text-teal-600 block">Matters</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg"
              >
                Comprehensive digital mental health support designed specifically for students. Get AI-guided support, book confidential sessions, access resources, and connect with your peers in a safe, supportive environment.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <button
                  onClick={onGetStarted}
                  className="bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start AI Chat
                </button>
                <button className="bg-white text-teal-600 border-2 border-teal-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-50 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Counseling
                </button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">AI Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Confidential</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-1">Free</div>
                  <div className="text-sm text-gray-600 font-medium">For Students</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image/Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-teal-100 to-green-100 rounded-3xl p-8 shadow-2xl">
                {/* Mock Interface */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Status Indicators */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Counselor Available
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                      AI Chat Active
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="h-80 relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                      alt="Students studying together in a supportive environment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-center z-10">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Users className="h-8 w-8 text-teal-600" />
                      </div>
                      <div className="text-white font-semibold text-lg">Students Supporting Students</div>
                    </div>
                  </div>

                  {/* Bottom Status */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageCircle className="h-4 w-4 mr-2 text-teal-600" />
                      AI Chat Active - Ready to help
                    </div>
                    <div className="text-xs text-gray-500">24/7 Available</div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-lg"
                >
                  <Heart className="h-6 w-6 text-red-500" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg"
                >
                  <Shield className="h-6 w-6 text-blue-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform brings together technology, professional expertise, and community support
              to create a holistic mental wellness experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors duration-200 group-hover:scale-110 transform">
                  <feature.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: '10K+', label: 'Students Supported' },
              { number: '500+', label: 'Professional Counsellors' },
              { number: '1K+', label: 'Peer Volunteers' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <div className="text-5xl lg:text-6xl font-bold mb-3 text-yellow-400">
                  {stat.number}
                </div>
                <div className="text-xl font-medium opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">Real stories from real people who found help through MindCare</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Take the First Step?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of people who have found support, guidance, and healing through our platform.
              Your journey to better mental health starts here.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-teal-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-teal-400 mr-2" />
                <span className="text-xl font-bold">MindCare</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive digital mental health platform providing support, resources, and community.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Chatbot Support</li>
                <li>Professional Counselling</li>
                <li>Resource Library</li>
                <li>Peer Forums</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Professionals</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Case Management</li>
                <li>Appointment System</li>
                <li>Secure Notes</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MindCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;