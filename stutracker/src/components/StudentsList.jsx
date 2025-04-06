import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import Navbar from "./Navbar"; // Adjust path
import Footer from "./Footer"; // Adjust path
import Button from "./Button"; // Adjust path
import ProgressBar from "./ProgressBar"; // Adjust path (assuming you have this component)
import { FiUser, FiBookOpen, FiTrash2, FiCopy } from "react-icons/fi";

const StudentsList = () => {
  const {
    user,
    getCourses,
    getStudentsInCourse,
    removeStudentFromCourse,
    getStudentProgressForCourse,
  } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [selectedStudentForProgress, setSelectedStudentForProgress] =
    useState(null);
  const [copiedEmails, setCopiedEmails] = useState("");

  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login");
      return;
    }
    const courses = getCourses(user.email);
    const allStudents = new Set();
    courses.forEach((course) => {
      getStudentsInCourse(course.id).forEach((student) =>
        allStudents.add(JSON.stringify(student))
      );
    });
    setStudents([...allStudents].map((s) => JSON.parse(s)));
  }, [user, navigate, getCourses, getStudentsInCourse]);

  const handleToggleDetails = (email) => {
    setExpandedStudent(expandedStudent === email ? null : email);
    if (selectedStudentForProgress === email) {
      setSelectedStudentForProgress(null); // Close progress if toggling courses
    }
  };

  const handleViewProgress = (email) => {
    setSelectedStudentForProgress(
      selectedStudentForProgress === email ? null : email
    );
    if (expandedStudent === email) {
      setExpandedStudent(null); // Close courses if toggling progress
    }
  };

  const handleRemoveStudent = async (courseId, studentEmail) => {
    if (window.confirm(`Remove ${studentEmail} from this course?`)) {
      await removeStudentFromCourse(courseId, studentEmail);
      const courses = getCourses(user.email);
      const allStudents = new Set();
      courses.forEach((course) => {
        getStudentsInCourse(course.id).forEach((student) =>
          allStudents.add(JSON.stringify(student))
        );
      });
      setStudents([...allStudents].map((s) => JSON.parse(s)));
      if (selectedStudentForProgress === studentEmail) {
        setSelectedStudentForProgress(null);
      }
      if (expandedStudent === studentEmail) {
        setExpandedStudent(null);
      }
    }
  };

  const handleCopyAllEmails = () => {
    const allEmails = students.map((student) => student.email).join(", ");
    setCopiedEmails(allEmails);
    navigator.clipboard.writeText(allEmails);
    alert("All student emails copied to clipboard!");
  };

  const getStudentCourses = (studentEmail) =>
    getCourses(user.email).filter((course) =>
      course.students.includes(studentEmail)
    );

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Active Students List
            </h1>
            <Button
              onClick={handleCopyAllEmails}
              className="bg-[var(--accent)] hover:bg-cyan-500 text-[var(--text-primary)] flex items-center gap-1"
            >
              <FiCopy className="inline" /> Copy All Emails
            </Button>
          </div>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
            {students.length > 0 ? (
              <ul className="space-y-4">
                {students.map((student) => (
                  <li
                    key={student.email}
                    className="bg-[var(--primary-bg-light)] p-4 rounded-lg text-[var(--text-secondary)]"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-[var(--accent)]" />
                        <span>
                          {student.firstName} {student.lastName} (
                          {student.email})
                        </span>
                        <button
                          onClick={() => handleToggleDetails(student.email)}
                          className="text-[var(--accent)] hover:underline ml-2"
                        >
                          {expandedStudent === student.email
                            ? "Hide Courses"
                            : "Courses"}
                        </button>
                        <button
                          onClick={() => handleViewProgress(student.email)}
                          className="text-[var(--accent)] hover:underline ml-2"
                        >
                          {selectedStudentForProgress === student.email
                            ? "Hide Progress"
                            : "Progress"}
                        </button>
                      </div>
                    </div>

                    {/* Courses Section */}
                    {expandedStudent === student.email && (
                      <div className="mt-4 pl-6 border-l-4 border-[var(--accent)]">
                        <h3 className="font-medium">Enrolled Courses:</h3>
                        {getStudentCourses(student.email).length > 0 ? (
                          getStudentCourses(student.email).map((course) => (
                            <div
                              key={course.id}
                              className="flex justify-between items-center mt-2"
                            >
                              <span>
                                {course.name} ({course.type})
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    navigate(`/course/${course.id}`)
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1"
                                >
                                  <FiBookOpen className="inline mr-1" /> View
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleRemoveStudent(
                                      course.id,
                                      student.email
                                    )
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-sm px-2 py-1"
                                >
                                  <FiTrash2 className="inline mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="mt-2">No courses enrolled.</p>
                        )}
                      </div>
                    )}

                    {/* Progress Section */}
                    {selectedStudentForProgress === student.email && (
                      <div className="mt-4 pl-6 border-l-4 border-[var(--accent)]">
                        <h3 className="font-medium">Student Progress:</h3>
                        {getStudentCourses(student.email).length > 0 ? (
                          getStudentCourses(student.email).map((course) => (
                            <div key={course.id} className="mt-2">
                              <h4 className="font-medium">{course.name}</h4>
                              {getStudentProgressForCourse(
                                student.email,
                                course.id
                              )?.length > 0 ? (
                                getStudentProgressForCourse(
                                  student.email,
                                  course.id
                                ).map((progress, idx) => (
                                  <ProgressBar
                                    key={idx}
                                    subject={progress.subject}
                                    percentage={progress.percentage}
                                    className="mb-2"
                                  />
                                ))
                              ) : (
                                <p className="text-sm mt-1">
                                  No progress data available for this course.
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="mt-2">No progress data available.</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                No active students enrolled in your courses.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentsList;
