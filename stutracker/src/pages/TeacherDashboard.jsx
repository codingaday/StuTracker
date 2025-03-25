import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import TeacherTeachingImage from "/images/dashboard-teacher-teaching.png";

const TeacherDashboard = () => {
  const {
    user,
    getProgressData,
    getCourses,
    addCourse,
    deleteCourse,
    addStudentToCourse,
    removeStudentFromCourse,
    getStudentsInCourse,
    getStudentProgress,
  } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentProgress, setStudentProgress] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Fetch class progress and courses
      const fetchedProgress = getProgressData(user.email, user.userType);
      const fetchedCourses = getCourses(user.email);
      setProgressData(fetchedProgress);
      setCourses(fetchedCourses);
    }
  }, [user, navigate, getProgressData, getCourses]);

  const handleAddCourse = () => {
    if (newCourseName.trim()) {
      addCourse(newCourseName, user.email);
      setNewCourseName("");
      setCourses(getCourses(user.email));
    }
  };

  const handleDeleteCourse = (courseId) => {
    deleteCourse(courseId);
    setCourses(getCourses(user.email));
    setSelectedCourse(null);
    setStudents([]);
    setStudentProgress(null);
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    const courseStudents = getStudentsInCourse(courseId);
    setStudents(courseStudents);
    setStudentProgress(null);
  };

  const handleAddStudent = () => {
    if (newStudentEmail.trim() && selectedCourse) {
      addStudentToCourse(selectedCourse, newStudentEmail);
      setNewStudentEmail("");
      setStudents(getStudentsInCourse(selectedCourse));
    }
  };

  const handleRemoveStudent = (studentEmail) => {
    if (selectedCourse) {
      removeStudentFromCourse(selectedCourse, studentEmail);
      setStudents(getStudentsInCourse(selectedCourse));
      setStudentProgress(null);
    }
  };

  const handleViewStudentProgress = (studentEmail) => {
    const progress = getStudentProgress(studentEmail);
    setStudentProgress({ email: studentEmail, progress });
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
              src={TeacherTeachingImage}
              alt="Academic Work"
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
            {user.role}, {user.school}
          </p>
        </div>

        {/* Class Progress Section */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Class Progress
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
                No class progress data available.
              </p>
            )}
          </div>
        </section>

        {/* Course Management Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Manage Courses
          </h2>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Add a New Course</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Enter course name"
                className="flex-1 bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              />
              <Button onClick={handleAddCourse}>Add Course</Button>
            </div>
          </div>

          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Your Courses</h3>
            {courses.length > 0 ? (
              <ul className="space-y-2">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="flex justify-between items-center"
                  >
                    <span
                      onClick={() => handleSelectCourse(course.id)}
                      className={`cursor-pointer ${
                        selectedCourse === course.id
                          ? "text-[var(--accent)]"
                          : ""
                      }`}
                    >
                      {course.name}
                    </span>
                    <Button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-red-500"
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                No courses available.
              </p>
            )}
          </div>
        </section>

        {/* Student Management Section */}
        {selectedCourse && (
          <section className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              Manage Students in{" "}
              {courses.find((c) => c.id === selectedCourse)?.name}
            </h2>
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Add a Student</h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="Enter student email"
                  className="flex-1 bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                />
                <Button onClick={handleAddStudent}>Add Student</Button>
              </div>
              <Link to="/signup">
                <Button className="w-full">Create New Student Account</Button>
              </Link>
            </div>

            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Students</h3>
              {students.length > 0 ? (
                <ul className="space-y-2">
                  {students.map((student) => (
                    <li
                      key={student.email}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {student.firstName} {student.lastName} ({student.email})
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleViewStudentProgress(student.email)
                          }
                          className="bg-blue-500"
                        >
                          View Progress
                        </Button>
                        <Button
                          onClick={() => handleRemoveStudent(student.email)}
                          className="bg-red-500"
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-[var(--text-secondary)]">
                  No students in this course.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Student Progress Section */}
        {studentProgress && (
          <section className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              Progress for {studentProgress.email}
            </h2>
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg">
              {studentProgress.progress.length > 0 ? (
                studentProgress.progress.map((data, index) => (
                  <ProgressBar
                    key={index}
                    subject={data.subject}
                    percentage={data.percentage}
                  />
                ))
              ) : (
                <p className="text-center text-[var(--text-secondary)]">
                  No progress data available for this student.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
