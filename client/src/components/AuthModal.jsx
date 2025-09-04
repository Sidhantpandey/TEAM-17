import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLogin, setIsLogin] = useState(true);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access counselling, resources, and peer support',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'counsellor',
      title: 'Counsellor',
      description: 'Manage appointments and provide professional support',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Moderate forums and provide peer support',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    // Simulate successful authentication
    const userData = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: selectedRole,
    };

    login(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Join MindCare'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!selectedRole ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <motion.button
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 text-left ${role.bgColor}`}
                    >
                      <div className="flex items-center">
                        <role.icon className={`h-8 w-8 ${role.color} mr-4`} />
                        <div>
                          <h4 className="font-semibold text-gray-900">{role.title}</h4>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-primary-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    {(() => {
                      const selectedRoleData = roles.find(r => r.id === selectedRole);
                      if (!selectedRoleData) return null;
                      
                      const SelectedRoleIcon = selectedRoleData.icon;
                      
                      return (
                        <>
                          {SelectedRoleIcon && (
                            <SelectedRoleIcon className={`h-5 w-5 ${selectedRoleData.color} mr-2`} />
                          )}
                          <span className="font-medium text-gray-900">
                            {selectedRoleData.title}
                          </span>
                        </>
                      );
                    })()}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('')}
                      className="ml-auto text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                )}

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;