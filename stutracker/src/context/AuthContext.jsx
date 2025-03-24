import { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

// Default mock data (used if localStorage is empty)
const defaultMockUsers = [
  {
    email: "student@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    userType: "student",
    gradeLevel: "11",
    school: "Sample School",
  },
  {
    email: "teacher@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    userType: "teacher",
    role: "Math Teacher",
    school: "Sample School",
  },
];

const defaultMockStudentProgress = {
  "student@example.com": [
    { subject: "Math", percentage: 75 },
    { subject: "Science", percentage: 60 },
    { subject: "English", percentage: 85 },
  ],
};

const defaultMockTeacherClassProgress = {
  "teacher@example.com": [
    { subject: "Class Average - Math", percentage: 82 },
    { subject: "Class Average - Science", percentage: 78 },
    { subject: "Class Average - English", percentage: 85 },
  ],
};

const defaultMockStreaks = {
  "student@example.com": 5,
  "teacher@example.com": 3,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize mock data from localStorage or use defaults
  const [mockUsers, setMockUsers] = useState(() => {
    const storedUsers = localStorage.getItem("mockUsers");
    return storedUsers ? JSON.parse(storedUsers) : defaultMockUsers;
  });

  const [mockStudentProgress, setMockStudentProgress] = useState(() => {
    const storedProgress = localStorage.getItem("mockStudentProgress");
    return storedProgress
      ? JSON.parse(storedProgress)
      : defaultMockStudentProgress;
  });

  const [mockTeacherClassProgress, setMockTeacherClassProgress] = useState(
    () => {
      const storedProgress = localStorage.getItem("mockTeacherClassProgress");
      return storedProgress
        ? JSON.parse(storedProgress)
        : defaultMockTeacherClassProgress;
    }
  );

  const [mockStreaks, setMockStreaks] = useState(() => {
    const storedStreaks = localStorage.getItem("mockStreaks");
    return storedStreaks ? JSON.parse(storedStreaks) : defaultMockStreaks;
  });

  // Save mock data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    localStorage.setItem(
      "mockStudentProgress",
      JSON.stringify(mockStudentProgress)
    );
  }, [mockStudentProgress]);

  useEffect(() => {
    localStorage.setItem(
      "mockTeacherClassProgress",
      JSON.stringify(mockTeacherClassProgress)
    );
  }, [mockTeacherClassProgress]);

  useEffect(() => {
    localStorage.setItem("mockStreaks", JSON.stringify(mockStreaks));
  }, [mockStreaks]);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  // Simulate signup (add user to mock database)
  const signup = (userData) => {
    const newUser = { ...userData };
    setMockUsers((prevUsers) => [...prevUsers, newUser]); // Add to mock database

    // Initialize progress and streak for the new user
    if (newUser.userType === "student") {
      setMockStudentProgress((prev) => ({
        ...prev,
        [newUser.email]: [
          { subject: "Math", percentage: 0 },
          { subject: "Science", percentage: 0 },
          { subject: "English", percentage: 0 },
        ],
      }));
    } else if (newUser.userType === "teacher") {
      setMockTeacherClassProgress((prev) => ({
        ...prev,
        [newUser.email]: [
          { subject: "Class Average - Math", percentage: 0 },
          { subject: "Class Average - Science", percentage: 0 },
          { subject: "Class Average - English", percentage: 0 },
        ],
      }));
    }
    setMockStreaks((prev) => ({
      ...prev,
      [newUser.email]: 0,
    }));

    const mockToken = `mock-jwt-${Date.now()}`; // Simulate a JWT token
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);
  };

  // Simulate logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Get progress data based on user type
  const getProgressData = (email, userType) => {
    if (userType === "student") {
      return mockStudentProgress[email] || [];
    } else if (userType === "teacher") {
      return mockTeacherClassProgress[email] || [];
    }
    return [];
  };

  // Get streak data
  const getStreak = (email) => {
    return mockStreaks[email] || 0;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, getProgressData, getStreak }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);
