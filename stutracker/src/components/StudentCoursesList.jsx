import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FiBookOpen } from "react-icons/fi";

const StudentCoursesList = () => {
  const { id } = useParams(); // Student email from URL
  const { user, getStudentCourses } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      // User is still loading from localStorage
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    // Fetch courses for the student ID (email) from the URL
    const coursesData = getStudentCourses(id);
    setCourses(coursesData);
    setLoading(false);
  }, [user, navigate, getStudentCourses, id]);

  // Render nothing while loading or if no user
  if (loading || !user) return null;

  // Optional: Check if the logged-in user matches the URL id
  if (user.email !== id) {
    return <div>Unauthorized: You can only view your own courses.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#333] mb-6">
            {user.email}'s Enrolled Courses
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {courses.length > 0 ? (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="bg-gray-100 p-4 rounded-lg text-gray-700 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <FiBookOpen className="text-blue-500" />
                      <span>
                        {course.name} ({course.type}) -{" "}
                        {course.done ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/student/${user.email}/courses`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    >
                      View Course
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No courses enrolled.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentCoursesList;
