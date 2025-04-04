import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import FileViewer from "./FileViewer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { FiBook, FiUpload, FiDownload } from "react-icons/fi";

const CoursePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, mockCourses } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [fileContent, setFileContent] = useState("");

  const { getRootProps: getDropzoneProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setShowFileViewer(true);
      }
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const foundCourse = mockCourses.find((c) => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        setFileContent(
          `Welcome to ${foundCourse.name}\n\nThis course contains 6 chapters covering all fundamental concepts.`
        );
      } else {
        navigate("/dashboard");
      }
    }
  }, [courseId, user, navigate, mockCourses]);

  const handleChapterSelect = (chapter) => {
    setCurrentChapter(chapter);
    setFileContent(
      `Chapter ${chapter} Content\n\n` +
        `This is the detailed content for chapter ${chapter} of ${course.name}.\n\n` +
        `Key topics covered:\n` +
        `- Topic 1\n- Topic 2\n- Topic 3\n\n` +
        `Learning objectives:\n` +
        `- Objective 1\n- Objective 2`
    );
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* File Upload Card */}
          <div
            {...getDropzoneProps()}
            className="mb-8 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-blue-300 transition-colors cursor-pointer"
          >
            <input {...getInputProps()} />
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FiUpload className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Upload Course Materials
              </h3>
              <p className="text-sm text-gray-500">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, Images, Text, Word
              </p>
            </div>
          </div>

          {/* Course Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {course.name}
              </h1>
              <p className="text-gray-600 mt-1">{course.description}</p>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full md:w-auto bg-gray-800 hover:bg-gray-900"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Course Content Area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chapters Navigation */}
            <div className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center gap-2">
                <FiBook className="text-gray-500" />
                Course Chapters
              </h2>
              <nav className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((chapter) => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                      currentChapter === chapter
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm">
                      {chapter}
                    </span>
                    <span>Chapter {chapter}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white p-8 rounded-xl shadow-sm min-h-[60vh]">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {currentChapter
                      ? `Chapter ${currentChapter}`
                      : "Course Overview"}
                  </h2>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {fileContent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* File Viewer Modal */}
      {showFileViewer && selectedFile && (
        <FileViewer
          file={selectedFile}
          onClose={() => setShowFileViewer(false)}
          onFileChange={(file) => {
            setSelectedFile(file);
            setShowFileViewer(true);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default CoursePage;
