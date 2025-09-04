import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  Users, 
  LogOut,
  Bell,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Heart,
  Shield
} from 'lucide-react';

const CounsellorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments');

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'notes', label: 'Case Notes', icon: FileText },
    { id: 'patients', label: 'Patients', icon: Users },
  ];

  const appointments = [
    {
      id: 1,
      patientName: 'John D.',
      time: '2:00 PM - 3:00 PM',
      date: 'Today',
      status: 'confirmed',
      type: 'Individual Therapy'
    },
    {
      id: 2,
      patientName: 'Sarah M.',
      time: '3:30 PM - 4:30 PM',
      date: 'Today',
      status: 'pending',
      type: 'Initial Consultation'
    },
    {
      id: 3,
      patientName: 'Michael R.',
      time: '10:00 AM - 11:00 AM',
      date: 'Tomorrow',
      status: 'confirmed',
      type: 'Follow-up Session'
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Appointment Management</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Slot
              </button>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                      <p className="text-sm text-gray-600 mb-1">{appointment.type}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.date} • {appointment.time}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <div className="flex space-x-1">
                        <button className="text-green-600 hover:text-green-700">
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Case Notes (Encrypted)</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  All case notes are encrypted and stored securely. Access is logged for compliance.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { patient: 'John D.', date: 'Today, 2:00 PM', session: 'Session #5' },
                { patient: 'Sarah M.', date: 'Yesterday, 3:30 PM', session: 'Initial Assessment' },
                { patient: 'Michael R.', date: '2 days ago', session: 'Session #3' },
              ].map((note, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{note.patient}</h4>
                      <p className="text-sm text-gray-600">{note.session}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {note.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Patient Overview</h3>
            
            <div className="grid gap-4">
              {[
                { name: 'John D.', sessions: 5, lastSeen: '2 hours ago', status: 'active' },
                { name: 'Sarah M.', sessions: 1, lastSeen: '1 day ago', status: 'new' },
                { name: 'Michael R.', sessions: 3, lastSeen: '3 days ago', status: 'active' },
              ].map((patient, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.sessions} sessions • Last seen {patient.lastSeen}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'new' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {patient.status}
                    </span>
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
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Dr. {user.name}</h1>
                <p className="text-sm text-gray-600">Counsellor Dashboard</p>
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Today's Appointments", value: '3', color: 'bg-blue-500' },
            { label: 'Active Patients', value: '28', color: 'bg-green-500' },
            { label: 'Pending Reviews', value: '5', color: 'bg-yellow-500' },
            { label: 'This Month', value: '94', color: 'bg-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <Calendar className="h-6 w-6 text-white" />
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

export default CounsellorDashboard;