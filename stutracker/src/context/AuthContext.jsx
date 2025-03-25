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

// Default mock courses and student assignments
const defaultMockCourses = [
  {
    id: "course1",
    name: "Math",
    teacherEmail: "teacher@example.com",
    students: ["student@example.com"],
  },
  {
    id: "course2",
    name: "Science",
    teacherEmail: "teacher@example.com",
    students: [],
  },
];

// Default mock goals for students
const defaultMockGoals = {
  "student@example.com": [],
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

  const [mockCourses, setMockCourses] = useState(() => {
    const storedCourses = localStorage.getItem("mockCourses");
    return storedCourses ? JSON.parse(storedCourses) : defaultMockCourses;
  });

  const [mockGoals, setMockGoals] = useState(() => {
    const storedGoals = localStorage.getItem("mockGoals");
    return storedGoals ? JSON.parse(storedGoals) : defaultMockGoals;
  });

  // Listen for localStorage changes to sync mockCourses across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "mockCourses") {
        const updatedCourses = event.newValue
          ? JSON.parse(event.newValue)
          : defaultMockCourses;
        console.log(
          "Detected localStorage change for mockCourses:",
          updatedCourses
        );
        setMockCourses(updatedCourses);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

  useEffect(() => {
    console.log("Saving mockCourses to localStorage:", mockCourses);
    localStorage.setItem("mockCourses", JSON.stringify(mockCourses));
  }, [mockCourses]);

  useEffect(() => {
    localStorage.setItem("mockGoals", JSON.stringify(mockGoals));
  }, [mockGoals]);

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

    // Initialize progress, streak, and goals for the new user
    if (newUser.userType === "student") {
      setMockStudentProgress((prev) => ({
        ...prev,
        [newUser.email]: [
          { subject: "Math", percentage: 0 },
          { subject: "Science", percentage: 0 },
          { subject: "English", percentage: 0 },
        ],
      }));
      setMockGoals((prev) => ({
        ...prev,
        [newUser.email]: [],
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

  // Add a course
  const addCourse = (courseName, teacherEmail) => {
    const newCourse = {
      id: `course${mockCourses.length + 1}`,
      name: courseName,
      teacherEmail,
      students: [],
    };
    setMockCourses((prev) => {
      const updatedCourses = [...prev, newCourse];
      console.log("Added new course:", updatedCourses);
      return updatedCourses;
    });
  };

  // Delete a course
  const deleteCourse = (courseId) => {
    setMockCourses((prev) => {
      const updatedCourses = prev.filter((course) => course.id !== courseId);
      console.log("Deleted course, updated courses:", updatedCourses);
      return updatedCourses;
    });
  };

  // Get courses for a teacher
  const getCourses = (teacherEmail) => {
    return mockCourses.filter((course) => course.teacherEmail === teacherEmail);
  };

  // Add a student to a course
  const addStudentToCourse = (courseId, studentEmail) => {
    setMockCourses((prev) => {
      const updatedCourses = prev.map((course) =>
        course.id === courseId
          ? { ...course, students: [...course.students, studentEmail] }
          : course
      );
      console.log(
        `Added student ${studentEmail} to course ${courseId}:`,
        updatedCourses
      );
      return updatedCourses;
    });
  };

  // Remove a student from a course
  const removeStudentFromCourse = (courseId, studentEmail) => {
    setMockCourses((prev) => {
      const updatedCourses = prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              students: course.students.filter(
                (email) => email !== studentEmail
              ),
            }
          : course
      );
      console.log(
        `Removed student ${studentEmail} from course ${courseId}:`,
        updatedCourses
      );
      return updatedCourses;
    });
  };

  // Get students in a course
  const getStudentsInCourse = (courseId) => {
    const course = mockCourses.find((course) => course.id === courseId);
    if (!course) return [];
    return mockUsers.filter(
      (user) =>
        user.userType === "student" && course.students.includes(user.email)
    );
  };

  // Get student progress
  const getStudentProgress = (studentEmail) => {
    return mockStudentProgress[studentEmail] || [];
  };

  // Get courses a student is enrolled in
  const getStudentCourses = (studentEmail) => {
    const studentCourses = mockCourses.filter((course) =>
      course.students.includes(studentEmail)
    );
    console.log(`Courses for student ${studentEmail}:`, studentCourses);
    return studentCourses;
  };

  // Get teacher details for a course
  const getTeacherForCourse = (teacherEmail) => {
    return mockUsers.find(
      (user) => user.email === teacherEmail && user.userType === "teacher"
    );
  };

  // Add a goal for a student
  const addGoal = (studentEmail, goal) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: [...(prev[studentEmail] || []), goal],
    }));
  };

  // Get goals for a student
  const getGoals = (studentEmail) => {
    return mockGoals[studentEmail] || [];
  };

  // Update user profile
  const updateProfile = (email, updatedData) => {
    setMockUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, ...updatedData } : u))
    );
    setUser((prev) =>
      prev.email === email ? { ...prev, ...updatedData } : prev
    );
    localStorage.setItem("user", JSON.stringify({ ...user, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        getProgressData,
        getStreak,
        addCourse,
        deleteCourse,
        getCourses,
        addStudentToCourse,
        removeStudentFromCourse,
        getStudentsInCourse,
        getStudentProgress,
        addGoal,
        getGoals,
        updateProfile,
        getStudentCourses,
        getTeacherForCourse,
        mockCourses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);
