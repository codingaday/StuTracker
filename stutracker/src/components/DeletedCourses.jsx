import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path
import Navbar from "../components/Navbar"; // Adjust path
import Footer from "../components/Footer"; // Adjust path
import { FiBookOpen } from "react-icons/fi";

const DeletedCourses = () => {
  const { user, getAllCoursesEver } = useAuth();
  const navigate = useNavigate();
  const [deletedCourses, setDeletedCourses] = useState([]);

  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login");
      return;
    }
    const allCourses = getAllCoursesEver();
    setDeletedCourses(
      allCourses.filter(
        (course) => course.teacherEmail === user.email && course.deleted
      )
    );
  }, [user, navigate, getAllCoursesEver]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
            Deleted Courses List
          </h1>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
            {deletedCourses.length > 0 ? (
              <ul className="space-y-4">
                {deletedCourses.map((course) => (
                  <li
                    key={course.id}
                    className="bg-[var(--primary-bg-light)] p-4 rounded-lg text-[var(--text-secondary)] flex items-center gap-2"
                  >
                    <FiBookOpen className="text-[var(--accent)]" />
                    <span>
                      {course.name} ({course.type}) - Deleted on{" "}
                      {new Date(course.createdAt).toLocaleDateString()} - by (
                      {user.email})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">
                No deleted courses found.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeletedCourses;
