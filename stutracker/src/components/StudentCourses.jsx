import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { FiBookOpen, FiTrash2 } from "react-icons/fi";

const StudentCourses = () => {
  const { user, getCourses, removeStudentFromCourse } = useAuth();
  const { email } = useParams(); // Get student email from URL
  const navigate = useNavigate();
  const [studentCourses, setStudentCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const { mockUsers } = useAuth();
  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login");
      return;
    }

    const courses = getCourses(user.email);
    const enrolledCourses = courses.filter((course) =>
      course.students.includes(email)
    );
    setStudentCourses(enrolledCourses);

    const mockStudent = mockUsers.find(
      (u) => u.email === email && u.userType === "student"
    );
    setStudent(
      mockStudent || { firstName: "Unknown", lastName: "Student", email }
    );
  }, [user, email, navigate, getCourses]);

  const handleRemoveStudent = async (courseId) => {
    if (window.confirm(`Remove ${student.email} from this course?`)) {
      await removeStudentFromCourse(courseId, student.email);
      const updatedCourses = getCourses(user.email).filter((course) =>
        course.students.includes(student.email)
      );
      setStudentCourses(updatedCourses);
    }
  };

  if (!user || !student) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Courses for {student.firstName} {student.lastName} (
              {student.email})
            </h1>
            <Button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Back
            </Button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {studentCourses.length > 0 ? (
              <ul className="space-y-4">
                {studentCourses.map((course) => (
                  <li
                    key={course.id}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200">
                        {course.name} ({course.type})
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                        >
                          <FiBookOpen className="inline mr-1" /> View
                        </Button>
                        <Button
                          onClick={() => handleRemoveStudent(course.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                          <FiTrash2 className="inline mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                {student.firstName} {student.lastName} is not enrolled in any of
                your courses.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentCourses;
