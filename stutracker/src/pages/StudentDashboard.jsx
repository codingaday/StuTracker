import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import StreakMotivator from "../components/StreakMotivator";
import QuizModal from "../components/QuizModal";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import StudentStudyingImage from "/images/dashboard-student-studying.png";

const StudentDashboard = () => {
  const {
    user,

    getProgressData,
    getStreak,
    addGoal,
    deleteGoal,
    getGoals,
    updateProfile,
    getTeacherForCourse,
    mockCourses,
    markGoalAsDone,
    markCourseAsDone,
    markMultipleCoursesAsDone,
    resetQuiz,
  } = useAuth();

  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [showGoals, setShowGoals] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    school: "",
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseSelectionMode, setIsCourseSelectionMode] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCourses, setShowCourses] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [newGoal, setNewGoal] = useState({ content: "", date: "" });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchedProgress = getProgressData(user.email, user.userType);
      const fetchedStreak = getStreak(user.email);
      const fetchedGoals = getGoals(user.email);
      const studentCourses = mockCourses.filter((course) =>
        course.students.includes(user.email)
      );

      setProgressData(fetchedProgress);
      setStreak(fetchedStreak);
      setGoals(fetchedGoals);
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        gradeLevel: user.gradeLevel,
        school: user.school,
      });
      setCourses(studentCourses);
    }
  }, [user, navigate, getProgressData, getStreak, getGoals, mockCourses]);

  useEffect(() => {
    setShowCourses(false);
    setShowGoals(false);
    setShowProgress(false);
  }, []);

  const handleAddGoal = () => {
    if (newGoal.content.trim() && newGoal.date) {
      const goalData = {
        content: newGoal.content,
        date: newGoal.date,
        done: false,
      };
      addGoal(user.email, goalData);
      setGoals(getGoals(user.email));
      setNewGoal({ content: "", date: "" });
      setIsAddGoalOpen(false);
    }
  };

  const handleDeleteGoal = (index) => {
    deleteGoal(user.email, index);
    setGoals(getGoals(user.email));
  };

  const handleMarkGoalAsDone = (index) => {
    markGoalAsDone(user.email, index);
    setGoals(getGoals(user.email));
  };

  const handleToggleCourseSelectionMode = () => {
    setIsCourseSelectionMode(!isCourseSelectionMode);
    setSelectedCourses([]);
  };

  const handleSelectCourse = (index) => {
    setSelectedCourses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAllCourses = () => {
    setSelectedCourses(
      selectedCourses.length === courses.length
        ? []
        : courses.map((_, index) => index)
    );
  };

  const handleMarkSelectedCoursesDone = async () => {
    if (selectedCourses.length > 0) {
      const courseIds = selectedCourses.map((index) => courses[index].id);
      const success = await markMultipleCoursesAsDone(courseIds);
      if (success) {
        setCourses((prev) =>
          prev.map((course) =>
            courseIds.includes(course.id) ? { ...course, done: true } : course
          )
        );
        setSelectedCourses([]);
        setIsCourseSelectionMode(false);
      }
    }
  };

  const handleMarkCourseDone = async (courseId) => {
    await markCourseAsDone(courseId);
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, done: true } : course
      )
    );
  };

  const handleEditProfile = () => {
    updateProfile(user.email, profileData);
    setIsEditingProfile(false);
  };

  const handleViewCourseDetails = (course) => {
    const teacher = getTeacherForCourse(course.teacherEmail);
    setSelectedCourse({ ...course, teacher });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left md:gap-8 px-4 py-8">
          <div className="mb-6">
            <img
              src={StudentStudyingImage}
              alt="Student Studying"
              className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
            />
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-6 md:ml-4 mt-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {user.firstName} {user.lastName}!
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] mt-2">
              {user.gradeLevel}th Grade
            </p>
            <p className="text-lg md:text-xl font-light text-[var(--text-secondary)] mt-2">
              School: {user.school}
            </p>
            <div className="flex gap-4 md:gap-6">
              <Button
                onClick={() => setIsEditingProfile(true)}
                className="mt-4 text-lg md:text-xl shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsAddGoalOpen(true)}
                className="mt-4 text-lg md:text-xl opacity-100 text-white bg-[var(--primary-bg-end)] shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Add Goal
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="First Name"
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                />
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                />
                <input
                  type="text"
                  value={profileData.gradeLevel}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      gradeLevel: e.target.value,
                    })
                  }
                  placeholder="Grade Level"
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                />
                <input
                  type="text"
                  value={profileData.school}
                  onChange={(e) =>
                    setProfileData({ ...profileData, school: e.target.value })
                  }
                  placeholder="School"
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                />
                <div className="flex gap-4">
                  <Button onClick={handleEditProfile} className="w-full">
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    className="w-full bg-red-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {isAddGoalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-8 rounded-xl max-w-lg w-full shadow-2xl border border-[var(--accent)]">
              <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] border-b pb-2">
                Add a New Goal
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddGoal();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="goalDate"
                    className="block text-[var(--text-primary)] font-medium mb-2"
                  >
                    Target Date
                  </label>
                  <input
                    type="date"
                    id="goalDate"
                    value={newGoal.date}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="goalContent"
                    className="block text-[var(--text-primary)] font-medium mb-2"
                  >
                    Goal Description
                  </label>
                  <textarea
                    id="goalContent"
                    value={newGoal.content}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, content: e.target.value })
                    }
                    placeholder="Enter your goal here..."
                    className="w-full min-h-[150px] bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-4 rounded-lg border border-[var(--accent)]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Characters: {newGoal.content.length} / 1000
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={!newGoal.content.trim() || !newGoal.date}
                  >
                    Save Goal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddGoalOpen(false);
                      setNewGoal({ content: "", date: "" });
                    }}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <section className="mb-12 mt-20">
          <div className="shadow-lg transform transition-all duration-300 hover:scale-105 max-w-4xl mx-auto bg-[var(--primary-bg-end)] rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold p-6">
                Current Progress
              </h2>
              <Button
                onClick={() => setShowProgress(!showProgress)}
                className="bg-[var(--accent)] hover:bg-cyan-500 md:w-90 w-35 mr-6"
              >
                {showProgress ? "Hide" : "View"}
              </Button>
            </div>
            {showProgress && (
              <div className="p-6">
                {progressData.length > 0 ? (
                  progressData.map((data, index) => (
                    <ProgressBar
                      key={index}
                      subject={data.subject}
                      percentage={data.percentage}
                    />
                  ))
                ) : (
                  <p className="text-center text-[var(--text-secondary)]">
                    No progress data available.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Courses Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="bg-[var(--primary-bg-end)] pr-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold p-6">
                Current Courses
              </h2>
              <div className="flex gap-2 mr-1">
                {showCourses && (
                  <Button
                    onClick={handleToggleCourseSelectionMode}
                    className={`hover:bg-cyan-500 w-35  ${
                      isCourseSelectionMode
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-[var(--accent)]"
                    }`}
                  >
                    {isCourseSelectionMode ? "Cancel" : "Select"}
                  </Button>
                )}
                <Button
                  onClick={() => setShowCourses(!showCourses)}
                  className={`"bg-[var(--accent)] hover:bg-cyan-500 w-35 ${
                    !showCourses ? "md:w-90" : "md:w-35"
                  }`}
                >
                  {showCourses ? "Hide" : "View"}
                </Button>
              </div>
            </div>

            {isCourseSelectionMode && (
              <div className="mb-4 flex gap-2 ml-6">
                <Button
                  onClick={handleSelectAllCourses}
                  className="bg-blue-500 hover:bg-blue-600 w-35"
                >
                  {selectedCourses.length === courses.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                {selectedCourses.length > 0 && (
                  <Button
                    onClick={handleMarkSelectedCoursesDone}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark as Done ({selectedCourses.length})
                  </Button>
                )}
              </div>
            )}

            {showCourses && (
              <>
                {courses.length > 0 ? (
                  <ul className="space-y-2 ml-6">
                    {courses.map((course, index) => (
                      <li
                        key={course.id}
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          selectedCourses.includes(index)
                            ? "bg-[var(--accent)] text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        } ${course.done ? "opacity-75" : ""}`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {isCourseSelectionMode && (
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(index)}
                              onChange={() => handleSelectCourse(index)}
                              className="w-5 h-5"
                            />
                          )}
                          <span
                            onClick={() => navigate(`/course/${course.id}`)}
                            className={`flex-1 ${
                              !isCourseSelectionMode
                                ? "cursor-pointer hover:text-[var(--accent)]"
                                : ""
                            }`}
                          >
                            {course.name}
                          </span>
                        </div>
                        {!isCourseSelectionMode && (
                          <div className="flex gap-2 items-center">
                            <Button
                              onClick={() => {
                                if (!course.done)
                                  handleMarkCourseDone(course.id);
                              }}
                              className={`flex justify-center items-center text-sm px-2 py-1 h-8 w-35 ${
                                course.done
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                              disabled={course.done}
                            >
                              {course.done ? "Completed" : "Done"}
                            </Button>
                            <Button
                              onClick={() => navigate(`/course/${course.id}`)}
                              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1 h-8 w-35"
                            >
                              Read
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-[var(--text-secondary)] p-6">
                    You are not enrolled in any courses.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{selectedCourse.name}</h2>
              <p className="mb-2">
                <strong>Teacher:</strong>{" "}
                {selectedCourse.teacher
                  ? `${selectedCourse.teacher.firstName} ${selectedCourse.teacher.lastName} (${selectedCourse.teacher.role})`
                  : "Unknown"}
              </p>
              <p className="mb-4">
                <strong>School:</strong>{" "}
                {selectedCourse.teacher?.school || "Unknown"}
              </p>
              <Button
                onClick={() => setSelectedCourse(null)}
                className="w-full hover:bg-cyan-500"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Goals Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold">Your Goals</h2>
              <Button
                onClick={() => setShowGoals(!showGoals)}
                className={`bg-[var(--accent)] hover:bg-cyan-500 w-35 ${
                  showGoals ? "md:w-35" : "md:w-90"
                }`}
              >
                {showGoals ? "Hide" : "View"}
              </Button>
            </div>
            {showGoals && (
              <>
                {goals.length > 0 ? (
                  <ul className="space-y-2">
                    {goals.map((goal, index) => (
                      <li
                        key={index}
                        className={`flex justify-between items-center p-2 rounded-lg text-[var(--text-secondary)] ${
                          goal.done ? "line-through opacity-75" : ""
                        }`}
                      >
                        <span className="flex-1">
                          {goal.content}{" "}
                          <span className="text-sm ml-2 text-gray-400">
                            {goal.date
                              ? `(Due: ${new Date(
                                  goal.date
                                ).toLocaleDateString()})`
                              : "(No date)"}
                          </span>
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleMarkGoalAsDone(index)}
                            className={`text-sm px-2 py-1 w-35 ${
                              goal.done
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            disabled={goal.done}
                          >
                            Done
                          </Button>
                          <Button
                            onClick={() => handleDeleteGoal(index)}
                            className="bg-red-500 hover:bg-red-600 text-sm px-2 py-1 w-35"
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-[var(--text-secondary)]">
                    No goals set yet.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Streak and Quiz Sections */}
        <section className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <StreakMotivator streak={streak} />
          </div>
          <div className="flex-1 bg-[var(--primary-bg-end)] p-6 rounded-lg text-center shadow-lg transform transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold mb-4">Daily Quiz Challenge</h3>
            <Button onClick={() => setIsQuizOpen(true)} className="w-90">
              Take a Quiz
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false);
          resetQuiz();
          setProgressData(getProgressData(user.email, user.userType));
        }}
      />
    </div>
  );
};

export default StudentDashboard;
