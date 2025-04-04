import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import TeacherTeachingImage from "/images/dashboard-teacher-teaching.png";

const TeacherDashboard = () => {
  const {
    user,
    getProgressData,
    getCourses,
    addCourse,
    deleteCourse,
    deleteMultipleCourses,
    addStudentToCourse,
    removeStudentFromCourse,
    getStudentsInCourse,
    getStudentProgressForCourse,
    updateProfile,
    mockCourses,
    mockUsers,
    studentExists,
    isStudentInCourse,
    isStudentRegistered,
    getStudentDetails,
  } = useAuth();

  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isCourseSelectionMode, setIsCourseSelectionMode] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showStudents, setShowStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
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
      setIsAddCourseOpen(false);
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setCourseStudents(getStudentsInCourse(courseId));
    setSelectedStudent(null);
  };

  const handleViewStudentProgress = (student) => {
    setSelectedStudent(student);
  };

  const handleAddStudent = async () => {
    if (!newStudentEmail.trim() || !selectedCourse) return;

    // Check if student exists in the system
    if (!isStudentRegistered(newStudentEmail)) {
      alert(
        "Student not found. Please ask the student to create an account first."
      );
      return;
    }

    // Check if student is already in the course
    if (isStudentInCourse(selectedCourse, newStudentEmail)) {
      alert("This student is already enrolled in the course");
      return;
    }

    try {
      await addStudentToCourse(selectedCourse, newStudentEmail);
      // Refresh the student list
      setCourseStudents(getStudentsInCourse(selectedCourse));
      setNewStudentEmail("");
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  const handleRemoveStudent = async (studentEmail) => {
    if (!selectedCourse) return;

    try {
      await removeStudentFromCourse(selectedCourse, studentEmail);
      // Refresh the student list
      setCourseStudents(getStudentsInCourse(selectedCourse));
      if (selectedStudent?.email === studentEmail) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Failed to remove student:", error);
      alert("Failed to remove student. Please try again.");
    }
  };

  const filteredStudents = courseStudents.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const email = student.email.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left md:gap-8 px-4 py-8">
          <div className="mb-6">
            <img
              src={TeacherTeachingImage}
              alt="Teacher Teaching"
              className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
            />
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-6 md:ml-4 mt-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {user?.firstName} {user?.lastName}!
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] mt-2">
              {user?.role}
            </p>
            <div className="flex gap-4 md:gap-6">
              <Button
                onClick={() => navigate("/edit-profile")}
                className="mt-4 text-xl md:text-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsAddCourseOpen(true)}
                className="mt-4 text-xl md:text-2xl opacity-100 text-white bg-[var(--primary-bg-end)] shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Add Course
              </Button>
            </div>
          </div>
        </div>

        {/* Add Course Modal */}
        {isAddCourseOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add New Course</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Enter course name"
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-lg"
                />
                <div className="flex gap-4">
                  <Button onClick={handleAddCourse} className="w-full">
                    Create Course
                  </Button>
                  <Button
                    onClick={() => setIsAddCourseOpen(false)}
                    className="w-full bg-red-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Class Progress Section */}
        <section className="mb-12 mt-20">
          <div className="shadow-lg transform transition-all duration-300 hover:scale-105 max-w-4xl mx-auto bg-[var(--primary-bg-end)] rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold p-6">
                Class Progress
              </h2>
              <div className="flex items-center justify-end pl-6 pt-6 pr-6 pb-9">
                <Button
                  onClick={() => setShowProgress(!showProgress)}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                >
                  {showProgress ? "Hide" : "Show"}
                </Button>
              </div>
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
                    No class progress data available.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Course Management Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Courses
          </h2>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Course List</h3>
              <Button
                onClick={() => setShowCourses(!showCourses)}
                className="bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
              >
                {showCourses ? "Hide" : "View"}
              </Button>
            </div>

            {showCourses && (
              <div className="space-y-2">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        selectedCourse === course.id
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--primary-bg-light)] hover:bg-[var(--accent-light)]"
                      }`}
                      onClick={() => handleSelectCourse(course.id)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{course.name}</span>
                        <span className="text-sm">
                          {course.students.length} students
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[var(--text-secondary)]">
                    No courses available.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Student Management Section */}
        {selectedCourse && (
          <section className="max-w-4xl mx-auto mb-12">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Students in{" "}
                  {courses.find((c) => c.id === selectedCourse)?.name}
                </h2>
                <Button
                  onClick={() => setShowStudents(!showStudents)}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                >
                  {showStudents ? "Hide" : "View"}
                </Button>
              </div>

              {showStudents && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Enroll New Student
                    </h3>
                    <div className="flex gap-4 mb-4">
                      <input
                        type="email"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="Enter student email"
                        className="flex-1 bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-lg"
                      />
                      <Button
                        onClick={handleAddStudent}
                        disabled={
                          !newStudentEmail ||
                          !isStudentRegistered(newStudentEmail)
                        }
                      >
                        Add Student
                      </Button>
                    </div>
                    {newStudentEmail && (
                      <div className="text-sm mb-4">
                        {isStudentRegistered(newStudentEmail) ? (
                          <span className="text-green-500">
                            ✓ Student is registered
                          </span>
                        ) : (
                          <span className="text-red-500">
                            ✗ Student not found.
                            <Link
                              to="/signup"
                              className="ml-2 text-blue-500 underline"
                            >
                              Create account
                            </Link>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Enrolled Students
                    </h3>
                    {courseStudents.length > 0 ? (
                      <>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search students..."
                            className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-2 rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          {filteredStudents.map((student) => (
                            <div
                              key={student.email}
                              className="bg-[var(--primary-bg-light)] p-3 rounded-lg"
                            >
                              <div className="flex justify-between items-center">
                                <span>
                                  {student.firstName} {student.lastName} (
                                  {student.email})
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() =>
                                      handleViewStudentProgress(student)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1"
                                  >
                                    View Progress
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleRemoveStudent(student.email)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>

                              {selectedStudent?.email === student.email && (
                                <div className="mt-3 pl-4 border-l-4 border-[var(--accent)]">
                                  <h4 className="font-medium mb-2">
                                    Progress:
                                  </h4>
                                  {getStudentProgressForCourse(
                                    student.email,
                                    selectedCourse
                                  )?.length > 0 ? (
                                    getStudentProgressForCourse(
                                      student.email,
                                      selectedCourse
                                    ).map((progress, idx) => (
                                      <ProgressBar
                                        key={idx}
                                        subject={progress.subject}
                                        percentage={progress.percentage}
                                        className="mb-2"
                                      />
                                    ))
                                  ) : (
                                    <p className="text-[var(--text-secondary)]">
                                      No progress data available
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-[var(--text-secondary)]">
                        No students enrolled in this course.
                      </p>
                    )}
                  </div>
                </>
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
