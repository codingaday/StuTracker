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

const defaultMockCourses = [
  {
    id: "course1",
    name: "Math",
    teacherEmail: "teacher@example.com",
    students: ["student@example.com"],
    done: false,
  },
  {
    id: "course2",
    name: "Science",
    teacherEmail: "teacher@example.com",
    students: [],
    done: false,
  },
];

const defaultMockGoals = {
  "student@example.com": [],
};

// Enhanced quiz data with chapter numbering
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
          "Ch-3": [
            {
              id: 3,
              question: "What is the area of a circle with radius 3?",
              options: ["6π", "9π", "3π", "12π"],
              correctAnswer: 1,
            },
          ],
          "Ch-4": [
            {
              id: 4,
              question: "How many sides does a pentagon have?",
              options: ["4", "5", "6", "7"],
              correctAnswer: 1,
            },
          ],
          "Ch-5": [
            {
              id: 5,
              question: "What is the derivative of x²?",
              options: ["x", "2x", "x³/3", "2"],
              correctAnswer: 1,
            },
          ],
          "Ch-6": [
            {
              id: 6,
              question: "What is the value of π (pi) to two decimal places?",
              options: ["3.14", "3.16", "3.12", "3.18"],
              correctAnswer: 0,
            },
          ],
        },
      },
      {
        id: 2,
        name: "Science",
        chapters: ["All", "Ch-1", "Ch-2", "Ch-3", "Ch-4", "Ch-5", "Ch-6"],
        questions: {
          "Ch-1": [
            {
              id: 7,
              question: "What is the unit of force?",
              options: ["Joule", "Newton", "Watt", "Pascal"],
              correctAnswer: 1,
            },
          ],
          "Ch-2": [
            {
              id: 8,
              question: "What is the acceleration due to gravity on Earth?",
              options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
              correctAnswer: 0,
            },
          ],
          "Ch-3": [
            {
              id: 9,
              question: "What is the chemical symbol for gold?",
              options: ["Go", "Gd", "Au", "Ag"],
              correctAnswer: 2,
            },
          ],
          "Ch-4": [
            {
              id: 10,
              question: "What is the powerhouse of the cell?",
              options: ["Nucleus", "Mitochondria", "Ribosome", "Cell membrane"],
              correctAnswer: 1,
            },
          ],
          "Ch-5": [
            {
              id: 11,
              question: "Which planet is known as the Red Planet?",
              options: ["Venus", "Mars", "Jupiter", "Saturn"],
              correctAnswer: 1,
            },
          ],
          "Ch-6": [
            {
              id: 12,
              question: "What is the atomic number of Oxygen?",
              options: ["6", "7", "8", "9"],
              correctAnswer: 2,
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
            chapters: ["All", "Ch-1", "Ch-2", "Ch-3", "Ch-4", "Ch-5", "Ch-6"],
            questions: {
              "Ch-1": [
                {
                  id: 13,
                  question: "In which year did World War II end?",
                  options: ["1943", "1945", "1947", "1950"],
                  correctAnswer: 1,
                },
              ],
              "Ch-2": [
                {
                  id: 14,
                  question: "Who was the first president of the United States?",
                  options: [
                    "Thomas Jefferson",
                    "George Washington",
                    "Abraham Lincoln",
                    "John Adams",
                  ],
                  correctAnswer: 1,
                },
              ],
              "Ch-3": [
                {
                  id: 15,
                  question: "What is the chemical symbol for water?",
                  options: ["H2O", "CO2", "NaCl", "O2"],
                  correctAnswer: 0,
                },
              ],
              "Ch-4": [
                {
                  id: 16,
                  question: "Who painted the Mona Lisa?",
                  options: [
                    "Vincent van Gogh",
                    "Pablo Picasso",
                    "Leonardo da Vinci",
                    "Michelangelo",
                  ],
                  correctAnswer: 2,
                },
              ],
              "Ch-5": [
                {
                  id: 17,
                  question: "What is the capital of France?",
                  options: ["London", "Berlin", "Paris", "Madrid"],
                  correctAnswer: 2,
                },
              ],
              "Ch-6": [
                {
                  id: 18,
                  question: "Which ocean is the largest?",
                  options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                  correctAnswer: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

const deleteMultipleCourses = (courseIds) => {
  const coursesToDelete = mockCourses.filter((c) => courseIds.includes(c.id));

  setMockCourses((prev) =>
    prev.filter((course) => !courseIds.includes(course.id))
  );

  // Remove these courses from all students' progress
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

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "mockCourses") {
        setMockCourses(
          event.newValue ? JSON.parse(event.newValue) : defaultMockCourses
        );
      } else if (event.key === "mockQuizzes") {
        setQuizzes(
          event.newValue ? JSON.parse(event.newValue) : defaultMockQuizzes
        );
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(
    () => localStorage.setItem("mockUsers", JSON.stringify(mockUsers)),
    [mockUsers]
  );
  useEffect(
    () =>
      localStorage.setItem(
        "mockStudentProgress",
        JSON.stringify(mockStudentProgress)
      ),
    [mockStudentProgress]
  );
  useEffect(
    () =>
      localStorage.setItem(
        "mockTeacherClassProgress",
        JSON.stringify(mockTeacherClassProgress)
      ),
    [mockTeacherClassProgress]
  );
  useEffect(
    () => localStorage.setItem("mockStreaks", JSON.stringify(mockStreaks)),
    [mockStreaks]
  );
  useEffect(
    () => localStorage.setItem("mockCourses", JSON.stringify(mockCourses)),
    [mockCourses]
  );
  useEffect(
    () => localStorage.setItem("mockGoals", JSON.stringify(mockGoals)),
    [mockGoals]
  );
  useEffect(
    () => localStorage.setItem("mockQuizzes", JSON.stringify(quizzes)),
    [quizzes]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
    // Check if user already exists
    if (mockUsers.some((u) => u.email === userData.email)) {
      throw new Error("User with this email already exists");
    }

    const newUser = { ...userData };
    setMockUsers((prevUsers) => [...prevUsers, newUser]);

    // Initialize student progress if it's a student
    if (newUser.userType === "student") {
      setMockStudentProgress((prev) => ({
        ...prev,
        [newUser.email]: mockCourses
          .filter((course) => course.students.includes(newUser.email))
          .map((course) => ({ subject: course.name, percentage: 0 })),
      }));
      setMockGoals((prev) => ({ ...prev, [newUser.email]: [] }));
      setMockStreaks((prev) => ({ ...prev, [newUser.email]: 0 }));
    } else if (newUser.userType === "teacher") {
      // Initialize teacher data
      setMockTeacherClassProgress((prev) => ({
        ...prev,
        [newUser.email]: [
          { subject: "Class Average - Math", percentage: 0 },
          { subject: "Class Average - Science", percentage: 0 },
          { subject: "Class Average - English", percentage: 0 },
        ],
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

  const getProgressData = (email, userType) => {
    if (userType === "student") {
      const studentCourses = mockCourses.filter((course) =>
        course.students.includes(email)
      );
      const progress = mockStudentProgress[email] || [];
      return studentCourses.map((course) => {
        const existingProgress = progress.find(
          (p) => p.subject === course.name
        );
        return {
          subject: course.name,
          percentage: existingProgress ? existingProgress.percentage : 0,
        };
      });
    } else if (userType === "teacher") {
      const teacherCourses = mockCourses.filter(
        (course) => course.teacherEmail === email
      );

      // Calculate average progress for each of the teacher's courses
      return teacherCourses.map((course) => {
        const studentsInCourse = mockUsers.filter(
          (user) =>
            user.userType === "student" && course.students.includes(user.email)
        );

        const averageProgress =
          studentsInCourse.length > 0
            ? Math.round(
                studentsInCourse.reduce((sum, student) => {
                  const studentProgress =
                    mockStudentProgress[student.email] || [];
                  const courseProgress = studentProgress.find(
                    (p) => p.subject === course.name
                  );
                  return sum + (courseProgress?.percentage || 0);
                }, 0) / studentsInCourse.length
              )
            : 0;

        return {
          subject: course.name,
          percentage: averageProgress,
        };
      });
    }
    return [];
  };

  const getStreak = (email) => mockStreaks[email] || 0;

  const addCourse = (courseName, teacherEmail) => {
    const newCourse = {
      id: `course${mockCourses.length + 1}`,
      name: courseName,
      teacherEmail,
      students: [],
      done: false,
    };
    setMockCourses((prev) => [...prev, newCourse]);
  };

  const deleteCourse = (courseId) => {
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) return;

    setMockCourses((prev) => prev.filter((course) => course.id !== courseId));

    // Remove this course from all students' progress
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

  const getCourses = (teacherEmail) =>
    mockCourses.filter((course) => course.teacherEmail === teacherEmail);

  const addStudentToCourse = (courseId, studentEmail) => {
    return new Promise((resolve, reject) => {
      try {
        setMockCourses((prev) =>
          prev.map((course) =>
            course.id === courseId && !course.students.includes(studentEmail)
              ? { ...course, students: [...course.students, studentEmail] }
              : course
          )
        );

        // Initialize progress for the student if they don't have any for this course
        setMockStudentProgress((prev) => {
          const course = mockCourses.find((c) => c.id === courseId);
          if (!course) return prev;

          const updated = { ...prev };
          if (!updated[studentEmail]) {
            updated[studentEmail] = [];
          }

          if (!updated[studentEmail].some((p) => p.subject === course.name)) {
            updated[studentEmail].push({
              subject: course.name,
              percentage: 0,
            });
          }

          return updated;
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const removeStudentFromCourse = (courseId, studentEmail) => {
    setMockCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              students: course.students.filter(
                (email) => email !== studentEmail
              ),
            }
          : course
      )
    );

    // Also remove the course progress for this student
    setMockStudentProgress((prev) => {
      const updated = { ...prev };
      const course = mockCourses.find((c) => c.id === courseId);
      if (course && updated[studentEmail]) {
        updated[studentEmail] = updated[studentEmail].filter(
          (p) => p.subject !== course.name
        );
      }
      return updated;
    });
  };

  const getStudentsInCourse = (courseId) => {
    const course = mockCourses.find((course) => course.id === courseId);
    return course
      ? mockUsers.filter(
          (user) =>
            user.userType === "student" && course.students.includes(user.email)
        )
      : [];
  };

  const getStudentProgress = (studentEmail) =>
    mockStudentProgress[studentEmail] || [];

  const getStudentCourses = (studentEmail) =>
    mockCourses.filter((course) => course.students.includes(studentEmail));

  const getTeacherForCourse = (teacherEmail) =>
    mockUsers.find(
      (user) => user.email === teacherEmail && user.userType === "teacher"
    );

  const addGoal = (studentEmail, goal) => {
    // Change parameter name to 'goal'
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: [
        ...(prev[studentEmail] || []),
        {
          content: goal.content, // Extract string content
          date: goal.date,
          done: goal.done || false,
        },
      ],
    }));
  };

  const deleteGoal = (studentEmail, goalIndex) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).filter(
        (_, index) => index !== goalIndex
      ),
    }));
  };

  const deleteMultipleGoals = (studentEmail, goalIndices) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).filter(
        (_, index) => !goalIndices.includes(index)
      ),
    }));
  };

  const getGoals = (studentEmail) => {
    const goals = mockGoals[studentEmail] || [];
    return goals.map((goal) => ({
      content: typeof goal.content === "string" ? goal.content : "",
      date: goal.date || "",
      done: goal.done || false,
    }));
  };

  const markGoalAsDone = (studentEmail, goalIndex) => {
    setMockGoals((prev) => ({
      ...prev,
      [studentEmail]: (prev[studentEmail] || []).map((goal, index) =>
        index === goalIndex ? { ...goal, done: true } : goal
      ),
    }));
  };

  const markCourseAsDone = (courseId) => {
    setMockCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, done: true } : course
      )
    );
  };

  const markMultipleCoursesAsDone = async (courseIds) => {
    try {
      setMockCourses((prev) =>
        prev.map((course) =>
          courseIds.includes(course.id) ? { ...course, done: true } : course
        )
      );
      return true;
    } catch (error) {
      console.error("Error marking courses as done:", error);
      return false;
    }
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

  const fetchQuizQuestions = async (selection) => {
    setCurrentSelection(selection);
    let questions = [];
    if (selection.type === "courseBased") {
      const course = quizzes.courseBased.courses.find(
        (c) => c.name === selection.course
      );
      if (course && course.questions) {
        if (selection.chapter === "All") {
          questions = Object.keys(course.questions)
            .filter((chapter) => chapter !== "All")
            .map((chapter) => course.questions[chapter] || [])
            .flat();
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
            questions = Object.keys(course.questions)
              .filter((chapter) => chapter !== "All")
              .map((chapter) => course.questions[chapter] || [])
              .flat();
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
    setQuizScore((prev) => {
      const newScore = prev + scoreIncrement;
      if (
        currentQuestionIndex === quizQuestions.length - 1 &&
        user?.userType === "student" &&
        currentSelection?.course
      ) {
        setMockStudentProgress((prevProgress) => {
          const updatedProgress = { ...prevProgress };
          const studentProgress = updatedProgress[user.email] || [];
          const subjectIndex = studentProgress.findIndex(
            (s) => s.subject === currentSelection.course
          );
          const finalScore = Math.round(newScore);

          if (subjectIndex >= 0) {
            updatedProgress[user.email] = studentProgress.map((subject, idx) =>
              idx === subjectIndex
                ? { ...subject, percentage: Math.min(finalScore, 100) }
                : subject
            );
          } else {
            updatedProgress[user.email] = [
              ...studentProgress,
              {
                subject: currentSelection.course,
                percentage: Math.min(finalScore, 100),
              },
            ];
          }
          return updatedProgress;
        });
        setQuizCompleted(true);
      }
      return newScore;
    });

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    if (user?.userType === "student" && currentSelection?.course) {
      setMockStudentProgress((prev) => {
        const updatedProgress = { ...prev };
        const studentProgress = updatedProgress[user.email] || [];
        const subjectIndex = studentProgress.findIndex(
          (s) => s.subject === currentSelection.course
        );
        const finalScore = Math.round(quizScore);

        if (subjectIndex >= 0) {
          updatedProgress[user.email] = studentProgress.map((subject, idx) =>
            idx === subjectIndex
              ? { ...subject, percentage: Math.min(finalScore, 100) }
              : subject
          );
        } else {
          updatedProgress[user.email] = [
            ...studentProgress,
            {
              subject: currentSelection.course,
              percentage: Math.min(finalScore, 100),
            },
          ];
        }
        return updatedProgress;
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
      const updatedCourses = prev.courseBased.courses.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            questions: {
              ...course.questions,
              [chapter]: [
                ...(course.questions[chapter] || []),
                ...newQuestions,
              ],
            },
          };
        }
        return course;
      });
      return {
        ...prev,
        courseBased: { ...prev.courseBased, courses: updatedCourses },
      };
    });
  };

  const getStudentProgressForCourse = (studentEmail, courseId) => {
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) return [];

    const studentProgress = mockStudentProgress[studentEmail] || [];
    return studentProgress.filter((p) => p.subject === course.name);
  };

  const studentExists = (email) => {
    return mockUsers.some((u) => u.email === email && u.userType === "student");
  };

  const isStudentInCourse = (courseId, studentEmail) => {
    const course = mockCourses.find((c) => c.id === courseId);
    return course?.students.includes(studentEmail) || false;
  };

  const isStudentRegistered = (email) => {
    return mockUsers.some(
      (user) => user.email === email && user.userType === "student"
    );
  };

  const getStudentDetails = (email) => {
    return mockUsers.find(
      (user) => user.email === email && user.userType === "student"
    );
  };

  const deleteMultipleCourses = (courseIds) => {
    try {
      // If you're using mock data, update your mockCourses array
      if (mockCourses) {
        setMockCourses((prev) =>
          prev.filter((course) => !courseIds.includes(course.id))
        );
      }

      // actual goes API goes here

      // await api.deleteMultipleCourses(courseIds);

      return true;
    } catch (error) {
      console.error("Error deleting courses:", error);
      return false;
    }
  };

  const enrollStudentsToCourses = async (studentEmails, courseIds) => {
    try {
      // Mock implementation - replace with actual API calls
      console.log(
        `Enrolling ${studentEmails.length} students to ${courseIds.length} courses`
      );

      // If using mock data:
      if (mockCourses) {
        setMockCourses((prev) =>
          prev.map((course) => {
            if (courseIds.includes(course.id)) {
              return {
                ...course,
                students: [...new Set([...course.students, ...studentEmails])],
              };
            }
            return course;
          })
        );
      }

      return true;
    } catch (error) {
      console.error("Enrollment error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        addCourse,
        getCourses,
        studentExists,
        isStudentInCourse,
        isStudentRegistered,
        getStudentDetails,
        token,
        login,
        signup,
        logout,
        getProgressData,
        getStreak,

        deleteCourse,

        addStudentToCourse,
        removeStudentFromCourse,
        getStudentsInCourse,
        getStudentProgress,
        getStudentCourses,
        getTeacherForCourse,
        markCourseAsDone,
        markMultipleCoursesAsDone,
        addGoal,
        deleteGoal,
        deleteMultipleGoals,
        getGoals,
        markGoalAsDone,
        updateProfile,
        mockCourses,
        mockUsers,
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
        deleteMultipleCourses,
        getStudentProgressForCourse,
        enrollStudentsToCourses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
