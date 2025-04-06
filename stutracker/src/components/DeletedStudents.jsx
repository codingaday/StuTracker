import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path
import Navbar from "../components/Navbar"; // Adjust path
import Footer from "../components/Footer"; // Adjust path
import { FiUser } from "react-icons/fi";

const DeletedStudents = () => {
  const { user, getAllStudentsEver, getCourses } = useAuth();
  const navigate = useNavigate();
  const [deletedStudentsWithCourse, setDeletedStudentsWithCourse] = useState(
    []
  );

  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login");
      return;
    }

    const activeStudents = new Set();
    const courseMap = new Map(); // To store course info for each student
    const courses = getCourses(user.email);

    // Build map of active students and their courses
    courses.forEach((course) => {
      course.students.forEach((email) => {
        activeStudents.add(email);
        courseMap.set(email, course.name); // Store course name for active students
      });
    });

    const allStudents = getAllStudentsEver();
    // Filter for students that aren't active and were associated with this teacher
    const deleted = allStudents
      .filter(
        (student) =>
          student.teacherEmail === user.email &&
          !activeStudents.has(student.email)
      )
      .map((student) => ({
        ...student,
        courseName: student.lastCourseName || "Unknown Course", // Fallback if no course history
      }));

    setDeletedStudentsWithCourse(deleted);
  }, [user, navigate, getCourses, getAllStudentsEver]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
            Deleted Students List
          </h1>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
            {deletedStudentsWithCourse.length > 0 ? (
              <ul className="space-y-4">
                {deletedStudentsWithCourse.map((student) => (
                  <li
                    key={student.email}
                    className="bg-[var(--primary-bg-light)] p-4 rounded-lg text-[var(--text-secondary)] flex items-center gap-2"
                  >
                    <FiUser className="text-[var(--accent)]" />
                    <span>
                      {student.firstName} {student.lastName} ({student.email}) -
                      Removed from {student.courseName} on{" "}
                      {new Date(student.createdAt).toLocaleDateString()} - by (
                      {user.email})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                No deleted students found.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeletedStudents;
