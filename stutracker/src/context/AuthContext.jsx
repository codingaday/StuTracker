import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Default mock data
const defaultMockUsers = [
  {
    email: "student@example.com",
    password: "@Password#123",
    firstName: "John",
    lastName: "Doe",
    userType: "student",
    gradeLevel: "11",
    school: "Sample School",
  },
  {
    email: "teacher@example.com",
    password: "@Password#123",
    firstName: "Jane",
    lastName: "Smith",
    userType: "teacher",
    role: "Math Teacher",
    school: "Sample School",
  },
  {
    email: "student2@example.com",
    password: "@Password#123",
    firstName: "Alice",
    lastName: "Johnson",
    userType: "student",
    gradeLevel: "10",
    school: "Sample School",
  },
];

const defaultMockStudentProgress = {
  "student@example.com": [
    { subject: "Mathematics", percentage: 75 },
    { subject: "Science", percentage: 60 },
  ],
  "student2@example.com": [{ subject: "Physics", percentage: 80 }],
};

const defaultMockTeacherClassProgress = {
  "teacher@example.com": [
    { subject: "Mathematics", percentage: 82 },
    { subject: "Physics", percentage: 78 },
  ],
};

const defaultMockStreaks = {
  "student@example.com": 5,
  "teacher@example.com": 3,
  "student2@example.com": 2,
};

const defaultMockCourses = [
  {
    id: "1",
    name: "Mathematics",
    teacherEmail: "teacher@example.com",
    students: ["student@example.com"],
    done: false,
    type: "Core",
    createdAt: "2024-01-01T10:00:00Z",
    deleted: false,
  },
  {
    id: "2",
    name: "Physics",
    teacherEmail: "teacher@example.com",
    students: ["student2@example.com"],
    done: true,
    type: "Elective",
    createdAt: "2024-02-01T10:00:00Z",
    deleted: false,
  },
  {
    id: "3",
    name: "Science",
    teacherEmail: "teacher@example.com",
    students: [],
    done: false,
    type: "Core",
    createdAt: "2024-03-01T10:00:00Z",
    deleted: true, // Soft-deleted course
  },
];

const defaultMockGoals = {
  "student@example.com": [
    { content: "Complete Math homework", date: "2024-04-01", done: false },
  ],
  "student2@example.com": [],
};

const defaultMockQuizzes = {
  courseBased: {
    courses: [
      {
        id: 1,
        name: "Mathematics",
        chapters: ["All", "Ch-1", "Ch-2", "Ch-3", "Ch-4", "Ch-5", "Ch-6"],
        questions: {
          "Ch-1": [
            {
              id: 1,
              question: "What is 2 + 2?",
              options: ["3", "4", "5", "6"],
              correctAnswer: 1,
            },
          ],
          "Ch-2": [
            {
              id: 2,
              question: "Solve for x: 3x + 5 = 20",
              options: ["3", "5", "7", "10"],
              correctAnswer: 1,
            },
          ],
        },
      },
      {
        id: 2,
        name: "Physics",
        chapters: ["All", "Ch-1", "Ch-2", "Ch-3"],
        questions: {
          "Ch-1": [
            {
              id: 3,
              question: "What is the unit of force?",
              options: ["Joule", "Newton", "Watt", "Pascal"],
              correctAnswer: 1,
            },
          ],
        },
      },
    ],
  },
  apiBased: {
    apis: [
      {
        id: 1,
        name: "OpenTrivia",
        courses: [
          {
            name: "General Knowledge",
            chapters: ["All", "Ch-1", "Ch-2"],
            questions: {
              "Ch-1": [
                {
                  id: 4,
                  question: "What is the capital of France?",
                  options: ["London", "Berlin", "Paris", "Madrid"],
                  correctAnswer: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
  const [quizzes, setQuizzes] = useState(() => {
    const storedQuizzes = localStorage.getItem("mockQuizzes");
    return storedQuizzes ? JSON.parse(storedQuizzes) : defaultMockQuizzes;
  });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);

  // Persist data to localStorage
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
    localStorage.setItem("mockCourses", JSON.stringify(mockCourses));
  }, [mockCourses]);
  useEffect(() => {
    localStorage.setItem("mockGoals", JSON.stringify(mockGoals));
  }, [mockGoals]);
  useEffect(() => {
    localStorage.setItem("mockQuizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Authentication Functions
  const login = (email, password) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const mockToken = `mock-jwt-${Date.now()}`;
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setToken(mockToken);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (userData) => {
    if (mockUsers.some((u) => u.email === userData.email)) {
      throw new Error("User with this email already exists");
    }
    const newUser = { ...userData };
    setMockUsers((prev) => [...prev, newUser]);

    if (newUser.userType === "student") {
      setMockStudentProgress((prev) => ({
        ...prev,
        [newUser.email]: [],
      }));
      setMockGoals((prev) => ({ ...prev, [newUser.email]: [] }));
      setMockStreaks((prev) => ({ ...prev, [newUser.email]: 0 }));
    } else if (newUser.userType === "teacher") {
      setMockTeacherClassProgress((prev) => ({
        ...prev,
        [newUser.email]: [],
      }));
      setMockStreaks((prev) => ({ ...prev, [newUser.email]: 0 }));
    }

    const mockToken = `mock-jwt-${Date.now()}`;
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateProfile = (email, updatedData) => {
    setMockUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, ...updatedData } : u))
    );
    setUser((prev) =>
      prev?.email === email ? { ...prev, ...updatedData } : prev
    );
    if (user?.email === email) {
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedData }));
    }
  };

  // Course Management Functions
  const addCourse = (name, teacherEmail, type = "Core") => {
    const newCourse = {
      id: String(mockCourses.length + 1),
      name,
      teacherEmail,
      students: [],
      done: false,
      type,
      createdAt: new Date().toISOString(),
      deleted: false,
    };
    setMockCourses((prev) => [...prev, newCourse]);
    setMockTeacherClassProgress((prev) => ({
      ...prev,
      [teacherEmail]: [
        ...(prev[teacherEmail] || []),
        { subject: name, percentage: 0 },
      ],
    }));
  };

  const deleteCourse = (courseId) => {
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) return;
    setMockCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, deleted: true } : c))
    );
    setMockStudentProgress((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((email) => {
        updated[email] = updated[email].filter(
          (p) => p.subject !== course.name
        );
      });
      return updated;
    });
  };

  const deleteMultipleCourses = (courseIds) => {
    const coursesToDelete = mockCourses.filter((c) => courseIds.includes(c.id));
    setMockCourses((prev) =>
      prev.map((c) => (courseIds.includes(c.id) ? { ...c, deleted: true } : c))
    );
    setMockStudentProgress((prev) => {
      const updated = { ...prev };
      const courseNames = coursesToDelete.map((c) => c.name);
      Object.keys(updated).forEach((email) => {
        updated[email] = updated[email].filter(
          (p) => !courseNames.includes(p.subject)
        );
      });
      return updated;
    });
  };

  const getCourses = (teacherEmail) =>
    mockCourses.filter((c) => c.teacherEmail === teacherEmail && !c.deleted);

  const markCourseAsDone = (courseId) => {
    setMockCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, done: true } : c))
    );
  };

  const markMultipleCoursesAsDone = (courseIds) => {
    setMockCourses((prev) =>
      prev.map((c) => (courseIds.includes(c.id) ? { ...c, done: true } : c))
    );
  };

  // Student Management Functions
  const addStudentToCourse = (courseId, studentEmail) => {
    const course = mockCourses.find((c) => c.id === courseId && !c.deleted);
    if (!course || course.students.includes(studentEmail)) return;
    setMockCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, students: [...c.students, studentEmail] }
          : c
      )
    );
    setMockStudentProgress((prev) => ({
      ...prev,
      [studentEmail]: [
        ...(prev[studentEmail] || []),
        { subject: course.name, percentage: 0 },
      ],
    }));
  };

  const removeStudentFromCourse = (courseId, studentEmail) => {
    const course = mockCourses.find((c) => c.id === courseId && !c.deleted);
    if (!course) return;
    setMockCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, students: c.students.filter((e) => e !== studentEmail) }
          : c
      )
    );
    setMockStudentProgress((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).filter(
        (p) => p.subject !== course.name
      ),
    }));
  };

  const enrollStudentsToCourses = (studentEmails, courseIds) => {
    const validCourses = mockCourses.filter(
      (c) => courseIds.includes(c.id) && !c.deleted
    );
    setMockCourses((prev) =>
      prev.map((c) =>
        courseIds.includes(c.id)
          ? { ...c, students: [...new Set([...c.students, ...studentEmails])] }
          : c
      )
    );
    setMockStudentProgress((prev) => {
      const updated = { ...prev };
      studentEmails.forEach((email) => {
        if (!updated[email]) updated[email] = [];
        validCourses.forEach((course) => {
          if (!updated[email].some((p) => p.subject === course.name)) {
            updated[email].push({ subject: course.name, percentage: 0 });
          }
        });
      });
      return updated;
    });
  };

  const getStudentsInCourse = (courseId) => {
    const course = mockCourses.find((c) => c.id === courseId && !c.deleted);
    return course
      ? mockUsers.filter(
          (u) => u.userType === "student" && course.students.includes(u.email)
        )
      : [];
  };

  const isStudentRegistered = (email) =>
    mockUsers.some((u) => u.userType === "student" && u.email === email);

  // Progress and Streaks
  const getProgressData = (email, userType) => {
    if (userType === "student") {
      return mockStudentProgress[email] || [];
    } else if (userType === "teacher") {
      const teacherCourses = mockCourses.filter(
        (c) => c.teacherEmail === email && !c.deleted
      );
      return teacherCourses.map((course) => {
        const students = getStudentsInCourse(course.id);
        const avg =
          students.length > 0
            ? students.reduce((sum, s) => {
                const prog =
                  mockStudentProgress[s.email]?.find(
                    (p) => p.subject === course.name
                  )?.percentage || 0;
                return sum + prog;
              }, 0) / students.length
            : 0;
        return { subject: course.name, percentage: Math.round(avg) };
      });
    }
    return [];
  };

  const getStudentProgressForCourse = (studentEmail, courseId) => {
    const course = mockCourses.find((c) => c.id === courseId && !c.deleted);
    if (!course) return [];
    return (
      mockStudentProgress[studentEmail]?.filter(
        (p) => p.subject === course.name
      ) || []
    );
  };

  const getStreak = (email) => mockStreaks[email] || 0;

  // Goals Management
  const addGoal = (studentEmail, goal) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: [
        ...(prev[studentEmail] || []),
        {
          content: goal.content,
          date: goal.date || new Date().toISOString(),
          done: false,
        },
      ],
    }));
  };

  const deleteGoal = (studentEmail, goalIndex) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).filter(
        (_, i) => i !== goalIndex
      ),
    }));
  };

  const deleteMultipleGoals = (studentEmail, goalIndices) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).filter(
        (_, i) => !goalIndices.includes(i)
      ),
    }));
  };

  const getGoals = (studentEmail) => mockGoals[studentEmail] || [];

  const markGoalAsDone = (studentEmail, goalIndex) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).map((g, i) =>
        i === goalIndex ? { ...g, done: true } : g
      ),
    }));
  };

  // Quiz Management
  const fetchQuizQuestions = (selection) => {
    setCurrentSelection(selection);
    let questions = [];
    if (selection.type === "courseBased") {
      const course = quizzes.courseBased.courses.find(
        (c) => c.name === selection.course
      );
      if (course && course.questions) {
        if (selection.chapter === "All") {
          questions = Object.values(course.questions).flat();
        } else {
          questions = course.questions[selection.chapter] || [];
        }
      }
    } else if (selection.type === "apiBased") {
      const api = quizzes.apiBased.apis.find(
        (a) => a.id === Number(selection.api)
      );
      if (api) {
        const course = api.courses.find((c) => c.name === selection.course);
        if (course && course.questions) {
          if (selection.chapter === "All") {
            questions = Object.values(course.questions).flat();
          } else {
            questions = course.questions[selection.chapter] || [];
          }
        }
      }
    }
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    return questions;
  };

  const submitQuizAnswer = (questionId, selectedOption) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    if (!question) return;
    const isCorrect = question.correctAnswer === selectedOption;
    const scoreIncrement = isCorrect ? 100 / quizQuestions.length : 0;
    setQuizScore((prev) => prev + scoreIncrement);

    if (
      currentQuestionIndex === quizQuestions.length - 1 &&
      user?.userType === "student"
    ) {
      setQuizCompleted(true);
      const finalScore = Math.round(quizScore + scoreIncrement);
      setMockStudentProgress((prev) => {
        const updated = { ...prev };
        const prog = updated[user.email] || [];
        const idx = prog.findIndex(
          (p) => p.subject === currentSelection.course
        );
        if (idx >= 0) {
          prog[idx].percentage = Math.max(prog[idx].percentage, finalScore);
        } else {
          prog.push({
            subject: currentSelection.course,
            percentage: finalScore,
          });
        }
        updated[user.email] = prog;
        return updated;
      });
    } else if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    if (user?.userType === "student" && currentSelection?.course) {
      const finalScore = Math.round(quizScore);
      setMockStudentProgress((prev) => {
        const updated = { ...prev };
        const prog = updated[user.email] || [];
        const idx = prog.findIndex(
          (p) => p.subject === currentSelection.course
        );
        if (idx >= 0) {
          prog[idx].percentage = Math.max(prog[idx].percentage, finalScore);
        } else {
          prog.push({
            subject: currentSelection.course,
            percentage: finalScore,
          });
        }
        updated[user.email] = prog;
        return updated;
      });
    }
    return quizScore;
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setCurrentSelection(null);
  };

  const addQuestionsToCourse = (courseId, chapter, newQuestions) => {
    setQuizzes((prev) => {
      const updatedCourses = prev.courseBased.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              questions: {
                ...c.questions,
                [chapter]: [...(c.questions[chapter] || []), ...newQuestions],
              },
            }
          : c
      );
      return {
        ...prev,
        courseBased: { ...prev.courseBased, courses: updatedCourses },
      };
    });
  };

  // Utility Functions
  const getStudentCourses = (studentEmail) =>
    mockCourses.filter((c) => c.students.includes(studentEmail) && !c.deleted);

  const getTeacherForCourse = (teacherEmail) =>
    mockUsers.find((u) => u.email === teacherEmail && u.userType === "teacher");

  const studentExists = (email) =>
    mockUsers.some((u) => u.email === email && u.userType === "student");

  const isStudentInCourse = (courseId, studentEmail) =>
    mockCourses.some(
      (c) =>
        c.id === courseId && c.students.includes(studentEmail) && !c.deleted
    );

  const getStudentDetails = (email) =>
    mockUsers.find((u) => u.email === email && u.userType === "student");

  const getAllCoursesEver = () => mockCourses;

  const getAllStudentsEver = () => {
    const allEmails = new Set(mockCourses.flatMap((c) => c.students));
    return mockUsers.filter(
      (u) => allEmails.has(u.email) && u.userType === "student"
    );
  };

  // Context Value
  const value = {
    user,
    token,
    login,
    signup,
    logout,
    updateProfile,
    mockUsers,
    mockCourses,
    getCourses,
    addCourse,
    deleteCourse,
    deleteMultipleCourses,
    markCourseAsDone,
    markMultipleCoursesAsDone,
    addStudentToCourse,
    removeStudentFromCourse,
    enrollStudentsToCourses,
    getStudentsInCourse,
    isStudentRegistered,
    getProgressData,
    getStudentProgressForCourse,
    getStreak,
    mockStudentProgress,
    mockTeacherClassProgress,
    mockStreaks,
    addGoal,
    deleteGoal,
    deleteMultipleGoals,
    getGoals,
    markGoalAsDone,
    mockGoals,
    quizzes,
    fetchQuizQuestions,
    submitQuizAnswer,
    completeQuiz,
    resetQuiz,
    quizQuestions,
    currentQuestionIndex,
    quizScore,
    quizCompleted,
    currentSelection,
    addQuestionsToCourse,
    getStudentCourses,
    getTeacherForCourse,
    studentExists,
    isStudentInCourse,
    getStudentDetails,
    getAllCoursesEver,
    getAllStudentsEver,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
