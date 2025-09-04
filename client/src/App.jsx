import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import StudentDashboard from './components/dashboards/StudentDashboard';
import CounsellorDashboard from './components/dashboards/CounsellorDashboard';
import VolunteerDashboard from './components/dashboards/VolunteerDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuth(true)} />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard user={user} onLogout={logout} />;
      case 'counsellor':
        return <CounsellorDashboard user={user} onLogout={logout} />;
      case 'volunteer':
        return <VolunteerDashboard user={user} onLogout={logout} />;
      default:
        return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={user.role}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderDashboard()}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;