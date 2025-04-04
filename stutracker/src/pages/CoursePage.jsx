import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, mockCourses } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const foundCourse = mockCourses.find((c) => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        // In a real app, you would fetch the actual course content here
        setFileContent(`This is the content for course: ${foundCourse.name}`);
      } else {
        navigate("/teacher-dashboard");
      }
    }
  }, [courseId, user, navigate, mockCourses]);

  const handleChapterSelect = (chapter) => {
    setCurrentChapter(chapter);
    // In a real app, you would load the specific chapter content here
    setFileContent(
      `This is the content for chapter ${chapter} of course: ${course.name}`
    );
  };

  if (!course) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">{course.name}</h1>
            <Button onClick={() => navigate("/teacher-dashboard")}>
              Back to Dashboard
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Chapters Sidebar */}
            <div className="w-full md:w-1/4 bg-[var(--primary-bg-end)] p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Chapters</h2>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((chapter) => (
                  <li key={chapter}>
                    <button
                      onClick={() => handleChapterSelect(chapter)}
                      className={`w-full text-left p-2 rounded-lg ${
                        currentChapter === chapter
                          ? "bg-[var(--accent)] text-[var(--text-primary)]"
                          : "hover:bg-[var(--accent-dark)]"
                      }`}
                    >
                      Chapter {chapter}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Content */}
            <div className="w-full md:w-3/4 bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg min-h-[60vh]">
              {currentChapter ? (
                <div className="prose max-w-none">
                  <h2>Chapter {currentChapter}</h2>
                  <div className="whitespace-pre-wrap">{fileContent}</div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <h2>Course Overview</h2>
                  <div className="whitespace-pre-wrap">{fileContent}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
