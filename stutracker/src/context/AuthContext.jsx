import { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

// Mock user database (simulating a backend)
const mockUsers = [
  {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    userType: "student",
    gradeLevel: "11",
    school: "Sample School",
  },
];

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simulate signup (add user to mock database)
  const signup = (userData) => {
    const newUser = { ...userData };
    mockUsers.push(newUser); // Add to mock database
    const mockToken = `mock-jwt-${Date.now()}`; // Simulate a JWT token
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);
  };

  // Simulate login (mock token generation)
  const login = (email, password) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const mockToken = `mock-jwt-${Date.now()}`; // Simulate a JWT token
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setToken(mockToken);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  // Simulate logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);
