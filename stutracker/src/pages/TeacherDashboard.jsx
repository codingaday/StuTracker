import { useState, useEffect, useRef } from "react";
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/json",
      "text/plain",
      "text/csv",
    ];
    const fileType = file.type;

    if (!validTypes.includes(fileType)) {
      alert("Please upload a valid file type (PDF, JSON, TXT, or CSV)");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    // Create preview for text-based files
    if (
      fileType === "application/json" ||
      fileType === "text/plain" ||
      fileType === "text/csv"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsText(file);
    } else if (fileType === "application/pdf") {
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadCourse = () => {
    if (!newCourseName.trim()) {
      alert("Please enter a course name");
      return;
    }

    if (selectedFile) {
      // Here you would typically upload the file to your server
      console.log("Uploading file:", selectedFile);

      // For demo purposes, we'll just add the course
      addCourse(newCourseName, user.email);

      // Process the file content if needed
      if (filePreview) {
        console.log("File content:", filePreview);
      }
    } else {
      // If no file, just create the course
      addCourse(newCourseName, user.email);
    }

    // Reset form
    setNewCourseName("");
    setSelectedFile(null);
    setFilePreview(null);
    setFileName("");
    setIsAddCourseOpen(false);
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Create New Course
                </h2>
                <button
                  onClick={() => setIsAddCourseOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="courseName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Enter course name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Course Material (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            ref={fileInputRef}
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.json,.txt,.csv"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, JSON, TXT, or CSV up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {selectedFile && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {selectedFile.type === "application/pdf" ? (
                            <svg
                              className="h-10 w-10 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-10 w-10 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {fileName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedFile.type} •{" "}
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="ml-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {filePreview && (
                      <div className="mt-3 max-h-60 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        {selectedFile.type === "application/pdf" ? (
                          <div className="flex items-center justify-center py-4">
                            <a
                              href={filePreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View PDF
                            </a>
                          </div>
                        ) : (
                          <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                            {filePreview.length > 1000
                              ? filePreview.substring(0, 1000) + "..."
                              : filePreview}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleUploadCourse}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Create Course
                  </button>
                  <button
                    onClick={() => {
                      setIsAddCourseOpen(false);
                      handleRemoveFile();
                    }}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
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
