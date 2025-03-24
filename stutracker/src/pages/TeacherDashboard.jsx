import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock state for courses and students
  const [courses, setCourses] = useState(["Math 101", "Science 202"]);
  const [students, setStudents] = useState(["John Doe", "Jane Smith"]);

  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.userType !== "teacher") return null;

  // Add course
  const addCourse = () => {
    const newCourse = prompt("Enter new course name:");
    if (newCourse) setCourses([...courses, newCourse]);
  };

  // Remove course
  const removeCourse = (course) => {
    setCourses(courses.filter((c) => c !== course));
  };

  // Add student
  const addStudent = () => {
    const newStudent = prompt("Enter new student name:");
    if (newStudent) setStudents([...students, newStudent]);
  };

  // Remove student
  const removeStudent = (student) => {
    setStudents(students.filter((s) => s !== student));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-4">
          Welcome, {user.firstName} {user.lastName}!
        </p>
        <p className="text-[var(--text-secondary)] mt-2">
          Role: {user.role || "Teacher"}, School: {user.school}
        </p>

        {/* Courses Section */}
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold">Courses</h2>
          <ul className="mt-2">
            {courses.map((course) => (
              <li key={course} className="flex justify-between py-1">
                {course}
                <button
                  onClick={() => removeCourse(course)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={addCourse}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>

        {/* Students Section */}
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold">Students</h2>
          <ul className="mt-2">
            {students.map((student) => (
              <li key={student} className="flex justify-between py-1">
                {student}
                <button
                  onClick={() => removeStudent(student)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={addStudent}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Student
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
