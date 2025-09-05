import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Allowed counselors & volunteers with emails
  const allowedUsers = [
    {
      email: "counsellor1@college.edu",
      password: "coun123",
      role: "counsellor",
      name: "Dr. Anjali Mehta",
    },
    {
      email: "volunteer1@college.edu",
      password: "vol123",
      role: "volunteer",
      name: "Rahul Sharma",
    },
  ];

  const login = (email, password) => {
    const foundUser = allowedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true; // login success
    } else {
      return false; // login failed
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Load session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
