import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path
import Navbar from "./Navbar"; // Adjust path
import Footer from "./Footer"; // Adjust path
import Button from "./Button"; // Adjust path
import { FiBookOpen, FiTrash2, FiUsers } from "react-icons/fi";

const CoursesList = () => {
  const { user, getCourses, deleteCourse } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login");
      return;
    }
    setCourses(getCourses(user.email));
  }, [user, navigate, getCourses]);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(courseId);
      setCourses(getCourses(user.email));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
            Active Courses List
          </h1>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
            {courses.length > 0 ? (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="bg-[var(--primary-bg-light)] p-4 rounded-lg text-[var(--text-secondary)] flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <FiBookOpen className="text-[var(--accent)]" />
                      <span>
                        {course.name} ({course.type}) -{" "}
                        {course.done ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1">
                        <FiUsers /> {course.students.length}
                      </span>
                      <Button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1"
                      >
                        <FiBookOpen className="inline mr-1" /> View
                      </Button>
                      <Button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="bg-red-500 hover:bg-red-600 text-sm px-2 py-1"
                      >
                        <FiTrash2 className="inline mr-1" /> Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                No active courses available.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesList;
