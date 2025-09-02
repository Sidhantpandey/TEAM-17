import React, { useState } from 'react';
import "tailwindcss";

const roles = ['vounteers', 'rescue_departments', 'super_admin'];

const CustomAlert = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
    <div className="relative p-8 bg-white w-96 max-w-sm m-auto flex-col flex rounded-lg shadow-xl">
      <div className="text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Message</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

const LoginPopUp = ({ setShowLogin, setLoggedInUser, setErrorMessage, allUsers, setAllUsers }) => {
  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vounteers" // Default role
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const onLogin = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (currState === "Sign Up") {

      if (allUsers.some(user => user.email === data.email)) {
        setErrorMessage("An account with this email already exists.");
        return;
      }

      const newUser = { ...data };
      setAllUsers(prevUsers => [...prevUsers, newUser]);
      setLoggedInUser(newUser);
      setShowLogin(false);
    } else {

      const user = allUsers.find(user => user.email === data.email && user.password === data.password);
      if (user) {
        setLoggedInUser(user);
        setShowLogin(false);
      } else {
        setErrorMessage("Invalid email or password.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={onLogin} className="relative p-6 bg-white rounded-lg shadow-lg w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{currState === "Sign Up" ? "Sign Up" : "Login"}</h2>
          <button type="button" onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {currState === "Sign Up" && (
            <>
              <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select name="role" onChange={onChangeHandler} value={data.role} className="p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {roles.map(role => (
                  <option key={role} value={role} className="capitalize">{role}</option>
                ))}
              </select>
            </>
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Your password" required className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full mt-4 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="text-sm text-gray-500 mt-4 text-center">
          {currState === "Login" ?
            <p>Create a new account? <span onClick={() => setCurrState("Sign Up")} className="text-blue-600 cursor-pointer hover:underline">Click here</span></p>
            :
            <p>Already have an account? <span onClick={() => setCurrState("Login")} className="text-blue-600 cursor-pointer hover:underline">Login here</span></p>
          }
        </div>
      </form>
    </div>
  );
};

const VolunteersDashboard = ({ user, onLogout }) => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome, Citizen {user.name}!</h1>
    <p className="text-lg text-gray-700 mb-6">You have access to public services and information.</p>
    <button onClick={onLogout} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Logout</button>
  </div>
);

const RescueDashboard = ({ user, onLogout }) => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome, Official {user.name}!</h1>
    <p className="text-lg text-gray-700 mb-6">You have administrative privileges and can manage public data.</p>
    <button onClick={onLogout} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Logout</button>
  </div>
);

const AdminDashboard = ({ user, onLogout }) => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome, Analyst {user.name}!</h1>
    <p className="text-lg text-gray-700 mb-6">You have access to reports and data analytics tools.</p>
    <button onClick={onLogout} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Logout</button>
  </div>
);

const NoAuthDashboard = ({ setShowLogin }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the App</h1>
      <p className="text-gray-600 mb-6">Please log in or sign up to continue.</p>
      <button onClick={() => setShowLogin(true)} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
        Log In / Sign Up
      </button>
    </div>
  </div>
);

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
  };

  const renderDashboard = () => {
    if (!user) {
      return <NoAuthDashboard setShowLogin={setShowLogin} />;
    }

    switch (user.role) {
      case 'volunteers':
        return <VolunteersDashboard user={user} onLogout={handleLogout} />;
      case 'official':
        return <RescueDashboard user={user} onLogout={handleLogout} />;
      case 'analyst':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      default:
        return <div className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Unknown Role</h1>
          <p className="text-lg text-gray-700 mb-6">Your role is not recognized. Please contact support.</p>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Logout</button>
        </div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="w-full">
        {renderDashboard()}
      </div>
      {showLogin && (
        <LoginPopUp
          setShowLogin={setShowLogin}
          setLoggedInUser={setUser}
          setErrorMessage={setErrorMessage}
          allUsers={allUsers}
          setAllUsers={setAllUsers}
        />
      )}
      {errorMessage && (
        <CustomAlert message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
    </div>
  );
};

export default App;
