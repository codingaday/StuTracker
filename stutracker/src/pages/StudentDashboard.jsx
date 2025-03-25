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
    getGoals,
    updateProfile,
    getTeacherForCourse,
    mockCourses,
  } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    school: "",
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Fetch progress, streak, goals
      const fetchedProgress = getProgressData(user.email, user.userType);
      const fetchedStreak = getStreak(user.email);
      const fetchedGoals = getGoals(user.email);
      setProgressData(fetchedProgress);
      setStreak(fetchedStreak);
      setGoals(fetchedGoals);
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        gradeLevel: user.gradeLevel,
        school: user.school,
      });

      // Derive courses directly from mockCourses
      const studentCourses = mockCourses.filter((course) =>
        course.students.includes(user.email)
      );
      console.log(
        `Student ${user.email} courses from mockCourses:`,
        studentCourses
      );
      setCourses(studentCourses);
    }
  }, [user, navigate, getProgressData, getStreak, getGoals, mockCourses]); // Depend on mockCourses directly

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addGoal(user.email, newGoal);
      setGoals(getGoals(user.email));
      setNewGoal("");
    }
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
      <main className="flex-1 px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img
              src={StudentStudyingImage}
              alt="Student Studying"
              className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
              onError={() =>
                console.error("Failed to load student studying image")
              }
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {user.gradeLevel}th Grade Student, {user.school}
          </p>
          <Button onClick={() => setIsEditingProfile(true)} className="mt-4">
            Edit Profile
          </Button>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    First Name:
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    Grade Level:
                  </label>
                  <input
                    type="text"
                    value={profileData.gradeLevel}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        gradeLevel: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    School:
                  </label>
                  <input
                    type="text"
                    value={profileData.school}
                    onChange={(e) =>
                      setProfileData({ ...profileData, school: e.target.value })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
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

        {/* Progress Section */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Progress
          </h2>
          <div className="max-w-2xl mx-auto">
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
        </section>

        {/* Courses Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Courses
          </h2>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg">
            {courses.length > 0 ? (
              <ul className="space-y-2">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="flex justify-between items-center"
                  >
                    <span
                      onClick={() => handleViewCourseDetails(course)}
                      className="cursor-pointer hover:text-[var(--accent)]"
                    >
                      {course.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                You are not enrolled in any courses.
              </p>
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
                {selectedCourse.teacher
                  ? selectedCourse.teacher.school
                  : "Unknown"}
              </p>
              <Button
                onClick={() => setSelectedCourse(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Goals Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Goals
          </h2>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Add a New Goal</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter your goal"
                className="flex-1 bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              />
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </div>
          </div>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Current Goals</h3>
            {goals.length > 0 ? (
              <ul className="space-y-2">
                {goals.map((goal, index) => (
                  <li key={index} className="text-[var(--text-secondary)]">
                    - {goal}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                No goals set yet.
              </p>
            )}
          </div>
        </section>

        {/* Streak and Quiz Sections */}
        <section className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Streak Motivator */}
          <div className="flex-1">
            <StreakMotivator streak={streak} />
          </div>

          {/* Quiz Challenge */}
          <div className="flex-1 bg-[var(--primary-bg-end)] p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Daily Quiz Challenge</h3>
            <Button onClick={() => setIsQuizOpen(true)}>Take a Quiz</Button>
          </div>
        </section>
      </main>
      <Footer />

      {/* Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default StudentDashboard;
