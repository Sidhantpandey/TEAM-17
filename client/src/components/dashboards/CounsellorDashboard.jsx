import { useState } from 'react';
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
  Shield,
  Search,
  Edit3,
  Video,
  MapPin,
  Filter,
  Phone,
  MessageCircle,
  AlertCircle,
  BookOpen,
  Activity,
  TrendingUp,
  User,
  Mail,
  FileEdit,
  Save,
  X
} from 'lucide-react';

const CounsellorDashboard = ({ user = { name: 'Sarah Johnson' }, onLogout = () => {} }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newNote, setNewNote] = useState('');

  // State for appointments with full CRUD operations
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John D.',
      patientId: 'PT001',
      time: '2:00 PM - 3:00 PM',
      date: 'Today',
      status: 'confirmed',
      type: 'Individual Therapy',
      mode: 'video',
      priority: 'normal',
      notes: 'Follow-up on anxiety management techniques',
      sessionNumber: 5,
      patientEmail: 'john.d@email.com'
    },
    {
      id: 2,
      patientName: 'Sarah M.',
      patientId: 'PT002',
      time: '3:30 PM - 4:30 PM',
      date: 'Today',
      status: 'pending',
      type: 'Initial Consultation',
      mode: 'in-person',
      priority: 'high',
      notes: 'New patient assessment - reported depression symptoms',
      sessionNumber: 1,
      patientEmail: 'sarah.m@email.com'
    },
    {
      id: 3,
      patientName: 'Michael R.',
      patientId: 'PT003',
      time: '10:00 AM - 11:00 AM',
      date: 'Tomorrow',
      status: 'confirmed',
      type: 'Follow-up Session',
      mode: 'video',
      priority: 'normal',
      notes: 'Review progress on coping strategies',
      sessionNumber: 3,
      patientEmail: 'michael.r@email.com'
    },
    {
      id: 4,
      patientName: 'Emma K.',
      patientId: 'PT004',
      time: '1:00 PM - 2:00 PM',
      date: 'Tomorrow',
      status: 'pending',
      type: 'Crisis Intervention',
      mode: 'urgent',
      priority: 'urgent',
      notes: 'Emergency session requested - anxiety attack',
      sessionNumber: 1,
      patientEmail: 'emma.k@email.com'
    }
  ]);

  // State for patients
  const [patients, setPatients] = useState([
    { 
      id: 'PT001',
      name: 'John D.', 
      sessions: 5, 
      lastSeen: '2 hours ago', 
      status: 'active',
      condition: 'Anxiety Disorder',
      riskLevel: 'low',
      nextAppointment: 'Today 2:00 PM',
      joinDate: '2024-01-15'
    },
    { 
      id: 'PT002',
      name: 'Sarah M.', 
      sessions: 1, 
      lastSeen: '1 day ago', 
      status: 'new',
      condition: 'Depression',
      riskLevel: 'medium',
      nextAppointment: 'Today 3:30 PM',
      joinDate: '2024-02-20'
    },
    { 
      id: 'PT003',
      name: 'Michael R.', 
      sessions: 3, 
      lastSeen: '3 days ago', 
      status: 'active',
      condition: 'Stress Management',
      riskLevel: 'low',
      nextAppointment: 'Tomorrow 10:00 AM',
      joinDate: '2024-01-28'
    },
    { 
      id: 'PT004',
      name: 'Emma K.', 
      sessions: 1, 
      lastSeen: 'Never', 
      status: 'urgent',
      condition: 'Panic Disorder',
      riskLevel: 'high',
      nextAppointment: 'Tomorrow 1:00 PM',
      joinDate: '2024-02-25'
    }
  ]);

  // State for case notes
  const [caseNotes, setCaseNotes] = useState([
    { 
      id: 1,
      patient: 'John D.', 
      patientId: 'PT001',
      date: 'Today, 2:00 PM', 
      session: 'Session #5',
      type: 'Progress Note',
      content: 'Patient showing significant improvement in managing anxiety symptoms. Discussed mindfulness techniques.',
      mood: 'Improved',
      riskAssessment: 'Low'
    },
    { 
      id: 2,
      patient: 'Sarah M.', 
      patientId: 'PT002',
      date: 'Yesterday, 3:30 PM', 
      session: 'Initial Assessment',
      type: 'Assessment',
      content: 'Initial evaluation completed. Patient reports persistent feelings of sadness and lack of motivation.',
      mood: 'Depressed',
      riskAssessment: 'Medium'
    },
    { 
      id: 3,
      patient: 'Michael R.', 
      patientId: 'PT003',
      date: '2 days ago', 
      session: 'Session #3',
      type: 'Progress Note',
      content: 'Working on stress management techniques. Patient reports better sleep patterns.',
      mood: 'Stable',
      riskAssessment: 'Low'
    },
  ]);

  // Statistics state
  const [stats, setStats] = useState({
    todaysAppointments: appointments.filter(apt => apt.date === 'Today').length,
    activePatients: patients.filter(p => p.status === 'active').length,
    pendingReviews: appointments.filter(apt => apt.status === 'pending').length,
    monthlyTotal: 94,
    confirmationsToday: 0,
    cancellationsToday: 0
  });

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'notes', label: 'Case Notes', icon: FileText },
    { id: 'patients', label: 'Patient Overview', icon: Users },
  ];

  // Appointment management functions
  const handleConfirmAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'confirmed' }
        : apt
    ));
    setStats(prev => ({
      ...prev,
      pendingReviews: prev.pendingReviews - 1,
      confirmationsToday: prev.confirmationsToday + 1
    }));
  };

  const handleRejectAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    setStats(prev => ({
      ...prev,
      pendingReviews: prev.pendingReviews - 1,
      cancellationsToday: prev.cancellationsToday + 1,
      todaysAppointments: prev.todaysAppointments - 1
    }));
  };

  const handleRescheduleAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'rescheduled', date: 'To be rescheduled' }
        : apt
    ));
  };

  // Case notes functions
  const handleAddNote = () => {
    if (newNote.trim() && selectedPatient) {
      const newNoteEntry = {
        id: caseNotes.length + 1,
        patient: selectedPatient.name,
        patientId: selectedPatient.id,
        date: new Date().toLocaleString(),
        session: `Session #${selectedPatient.sessions + 1}`,
        type: 'Progress Note',
        content: newNote,
        mood: 'To be assessed',
        riskAssessment: 'To be assessed'
      };
      setCaseNotes(prev => [newNoteEntry, ...prev]);
      setNewNote('');
      setSelectedPatient(null);
      setShowNewNoteModal(false);
    }
  };

  // Filter functions
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredNotes = caseNotes.filter(note => {
    const matchesSearch = note.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
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
                  <option value="confirmed">Confirmed</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
                <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all flex items-center gap-2 font-medium">
                  <Plus className="h-4 w-4" />
                  New Appointment
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Appointment Management</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Last updated: 2 min ago
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                          {getModeIcon(appointment.mode)}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-1">{appointment.patientName}</h4>
                          <p className="text-sm font-medium text-gray-700 mb-2">{appointment.type}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.date} • {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Session #{appointment.sessionNumber}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(appointment.priority)}`}>
                          {appointment.priority.toUpperCase()}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed">{appointment.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      {appointment.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleRescheduleAppointment(appointment.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <Calendar className="h-4 w-4" />
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleRejectAppointment(appointment.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        Message Patient
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <FileEdit className="h-4 w-4" />
                        View Notes
                      </button>
                    </div>
                  </div>
                ))}

                {filteredAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h4>
                    <p className="text-gray-600">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No appointments scheduled for the selected period.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search case notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={() => setShowNewNoteModal(true)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all flex items-center gap-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  New Note
                </button>
              </div>
            </div>

            {/* Case Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Case Notes (Encrypted)</h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 text-sm font-medium mb-1">HIPAA Compliance Notice</p>
                    <p className="text-amber-700 text-sm">
                      All case notes are encrypted end-to-end and stored securely. Access is logged for compliance with healthcare regulations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{note.patient}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{note.session}</span>
                          <span>•</span>
                          <span>{note.date}</span>
                          <span>•</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.type.toLowerCase())}`}>
                            {note.type}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 text-sm leading-relaxed">{note.content}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Mood Assessment:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(note.mood === 'Improved' ? 'low' : note.mood === 'Stable' ? 'medium' : 'high')}`}>
                          {note.mood}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(note.riskAssessment.toLowerCase())}`}>
                          {note.riskAssessment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredNotes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No case notes found</h4>
                    <p className="text-gray-600">Start by creating a new case note for your patients.</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Note Modal */}
            {showNewNoteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Add New Case Note</h3>
                    <button 
                      onClick={() => setShowNewNoteModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                      <select
                        value={selectedPatient?.id || ''}
                        onChange={(e) => setSelectedPatient(patients.find(p => p.id === e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Choose a patient...</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>{patient.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Case Note</label>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter your case note here..."
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddNote}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all flex items-center gap-2 font-medium"
                      >
                        <Save className="h-4 w-4" />
                        Save Note
                      </button>
                      <button
                        onClick={() => setShowNewNoteModal(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
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
                  <option value="all">All Patients</option>
                  <option value="active">Active</option>
                  <option value="new">New</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Patient Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Patient Overview</h3>
              
              <div className="grid gap-6">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-1">{patient.name}</h4>
                          <p className="text-sm font-medium text-gray-700 mb-2">{patient.condition}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{patient.sessions} sessions</span>
                            <span>•</span>
                            <span>Last seen: {patient.lastSeen}</span>
                            <span>•</span>
                            <span>Joined: {patient.joinDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel.toUpperCase()} RISK
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                          {patient.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Next Appointment:</span>
                        <span>{patient.nextAppointment}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Schedule Session
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <FileText className="h-4 w-4" />
                        View History
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        Send Message
                      </button>
                      {patient.riskLevel === 'high' && (
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                          <AlertCircle className="h-4 w-4" />
                          Crisis Protocol
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h4>
                    <p className="text-gray-600">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No patients match the current criteria.'}
                    </p>
                  </div>
                )}
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
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dr. {user.name}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Licensed Counsellor • Available
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.pendingReviews}
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: "Today's Appointments", 
              value: stats.todaysAppointments, 
              color: 'from-blue-500 to-blue-600',
              icon: Calendar,
              trend: `${stats.confirmationsToday} confirmed today`
            },
            { 
              label: 'Active Patients', 
              value: stats.activePatients, 
              color: 'from-green-500 to-green-600',
              icon: Users,
              trend: 'Under active care'
            },
            { 
              label: 'Pending Reviews', 
              value: stats.pendingReviews, 
              color: 'from-yellow-500 to-yellow-600',
              icon: Clock,
              trend: 'Awaiting approval'
            },
            { 
              label: 'This Month', 
              value: stats.monthlyTotal, 
              color: 'from-purple-500 to-purple-600',
              icon: TrendingUp,
              trend: 'Total sessions'
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
                    <Plus className="h-4 w-4 mr-2" />
                    Emergency Session
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Treatment Guidelines
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Activity className="h-4 w-4 mr-2" />
                    Progress Reports
                  </button>
                </div>
              </div>

              {/* Emergency Protocols */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Emergency Protocols</h4>
                <div className="space-y-2">
                  <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 text-sm rounded-lg transition-colors flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Crisis Intervention
                  </button>
                  <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 text-sm rounded-lg transition-colors flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Contacts
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

export default CounsellorDashboard;