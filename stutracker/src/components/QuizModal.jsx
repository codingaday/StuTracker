import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const QuizModal = ({ isOpen, onClose, courseId = null }) => {
  const {
    quizzes = { apiBased: { apis: [] }, courseBased: { courses: [] } },
    mockCourses,
    fetchQuizQuestions,
    submitQuizAnswer,
    quizScore,
    quizCompleted,
    resetQuiz,
    completeQuiz,
  } = useAuth();

  const [quizType, setQuizType] = useState(null);
  const [courseBasedCourse, setCourseBasedCourse] = useState("");
  const [courseBasedChapter, setCourseBasedChapter] = useState("All");
  const [apiBasedApi, setApiBasedApi] = useState("");
  const [apiBasedCourse, setApiBasedCourse] = useState("");
  const [apiBasedChapter, setApiBasedChapter] = useState("All");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localQuizQuestions, setLocalQuizQuestions] = useState([]);
  const [localCurrentIndex, setLocalCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("rgba(0, 0, 0, 0.7)");

  const availableApis = quizzes?.apiBased?.apis || [];
  const courseBasedCourses = quizzes?.courseBased?.courses || [];
  const apiBasedCourses =
    (apiBasedApi &&
      availableApis.find((a) => a.id === Number(apiBasedApi))?.courses) ||
    [];
  const courseBasedChapters = courseBasedCourse
    ? courseBasedCourses.find((c) => c.name === courseBasedCourse)
        ?.chapters || ["All"]
    : ["All"];
  const apiBasedChapters = apiBasedCourse
    ? apiBasedCourses.find((c) => c.name === apiBasedCourse)?.chapters || [
        "All",
      ]
    : ["All"];

  useEffect(() => {
    if (!isOpen) {
      resetState();
    } else if (courseId) {
      // Auto-start quiz for specific course
      const course = mockCourses.find((c) => c.id === courseId && !c.deleted);
      if (course) {
        setQuizType("courseBased");
        setCourseBasedCourse(course.name);
        setCourseBasedChapter("All");
        setIsDropdownOpen(false);
        handleStartQuizForCourse(course.name);
      }
    }
  }, [isOpen, courseId, mockCourses]);

  const resetState = () => {
    setQuizType(null);
    setCourseBasedCourse("");
    setCourseBasedChapter("All");
    setApiBasedApi("");
    setApiBasedCourse("");
    setApiBasedChapter("All");
    setSelectedOption(null);
    setShowQuiz(false);
    setIsDropdownOpen(false);
    setLocalQuizQuestions([]);
    setLocalCurrentIndex(0);
    setError(null);
    setBackgroundColor("rgba(0, 0, 0, 0.7)");
    resetQuiz();
  };

  const handleStartQuizForCourse = async (courseName) => {
    setIsLoading(true);
    setError(null);
    try {
      const selection = {
        type: "courseBased",
        course: courseName,
        chapter: "All",
      };
      const questions = await fetchQuizQuestions(selection);
      if (questions && questions.length > 0) {
        setLocalQuizQuestions(questions);
        setLocalCurrentIndex(0);
        setShowQuiz(true);
        setSelectedOption(null);
      } else {
        setError(`No questions available for ${courseName}.`);
        setShowQuiz(false);
      }
    } catch (error) {
      setError("Failed to load quiz questions. Please try again.");
      setShowQuiz(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const selection =
        quizType === "courseBased"
          ? {
              type: "courseBased",
              course: courseBasedCourse,
              chapter: courseBasedChapter,
            }
          : {
              type: "apiBased",
              api: Number(apiBasedApi),
              course: apiBasedCourse,
              chapter: apiBasedChapter,
            };
      const questions = await fetchQuizQuestions(selection);
      if (questions && questions.length > 0) {
        setLocalQuizQuestions(questions);
        setLocalCurrentIndex(0);
        setShowQuiz(true);
        setIsDropdownOpen(false);
        setSelectedOption(null);
      } else {
        setError("No questions available for this selection.");
        setShowQuiz(false);
      }
    } catch (error) {
      setError("Failed to load quiz questions. Please try again.");
      setShowQuiz(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    submitQuizAnswer(localQuizQuestions[localCurrentIndex].id, selectedOption);
    if (localCurrentIndex < localQuizQuestions.length - 1) {
      setLocalCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (localCurrentIndex > 0) {
      setLocalCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  const handleSubmitQuiz = () => {
    if (selectedOption !== null) {
      submitQuizAnswer(
        localQuizQuestions[localCurrentIndex].id,
        selectedOption
      );
    }
    const finalScore = completeQuiz();
    updateBackgroundColor(finalScore);
  };

  const updateBackgroundColor = (score) => {
    if (score >= 80) {
      setBackgroundColor("linear-gradient(135deg, #4CAF50, #81C784)");
    } else if (score >= 50) {
      setBackgroundColor("linear-gradient(135deg, #FFCA28, #FFD54F)");
    } else {
      setBackgroundColor("linear-gradient(135deg, #F44336, #EF5350)");
    }
  };

  const getPerformanceMessage = (score) => {
    if (score >= 80) return "Excellent job! You nailed it!";
    if (score >= 50) return "Good effort! You're on the right track!";
    return "Nice try! There's room for improvement.";
  };

  const getRecommendation = (score) => {
    if (score >= 80)
      return "Keep up the great work! Try challenging yourself with advanced topics.";
    if (score >= 50)
      return "Review the material and try again to boost your score!";
    return "Focus on revisiting the basics and practice more quizzes.";
  };

  const handleRetake = () => {
    resetQuiz();
    setLocalQuizQuestions([]);
    setLocalCurrentIndex(0);
    setSelectedOption(null);
    setShowQuiz(false);
    setIsDropdownOpen(true);
    setBackgroundColor("rgba(0, 0, 0, 0.7)");
    if (courseId) {
      const course = mockCourses.find((c) => c.id === courseId && !c.deleted);
      if (course) handleStartQuizForCourse(course.name);
    }
  };

  const handleExit = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
      style={{ background: backgroundColor }}
    >
      <div className="bg-[var(--primary-bg-end)] p-6 rounded-xl h-screen max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--accent)]">
        {!showQuiz ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Take a Quiz
              </h2>
              <button
                onClick={handleCancel}
                className="text-[var(--text-primary)] hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-4 bg-[var(--accent)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--accent-dark)] transition-colors flex justify-between items-center"
                disabled={courseId} // Disable manual selection if courseId is provided
              >
                <span>
                  {quizType
                    ? `${quizType} Quiz`
                    : courseId
                    ? `Quiz for Course`
                    : "Select Quiz Type"}
                </span>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {isDropdownOpen && !courseId && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[var(--primary-bg-start)] rounded-lg shadow-lg z-10 p-4 border border-[var(--accent)]">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                        Course-Based
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[var(--text-primary)] mb-1">
                            Select Course
                          </label>
                          <select
                            className="w-full p-2 bg-[var(--accent)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-dark)]"
                            value={courseBasedCourse}
                            onChange={(e) => {
                              setQuizType("courseBased");
                              setCourseBasedCourse(e.target.value);
                              setCourseBasedChapter("All");
                              setApiBasedApi("");
                              setApiBasedCourse("");
                              setApiBasedChapter("All");
                            }}
                          >
                            <option value="">Choose a Course</option>
                            {courseBasedCourses.map((course) => (
                              <option key={course.id} value={course.name}>
                                {course.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[var(--text-primary)] mb-1">
                            Select Chapter
                          </label>
                          <select
                            className="w-full p-2 bg-[var(--accent)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-dark)]"
                            value={courseBasedChapter}
                            onChange={(e) =>
                              setCourseBasedChapter(e.target.value)
                            }
                            disabled={!courseBasedCourse}
                          >
                            {courseBasedChapters.map((chapter, index) => (
                              <option key={index} value={chapter}>
                                {chapter}
                              </option>
                            ))}
                          </select>
                        </div>
                        {quizType === "courseBased" && (
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={handleCancel}
                              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleStartQuiz}
                              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              disabled={!courseBasedCourse || isLoading}
                            >
                              {isLoading ? "Loading..." : "Start Quiz"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                        API-Based
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[var(--text-primary)] mb-1">
                            Select API
                          </label>
                          <select
                            className="w-full p-2 bg-[var(--accent)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-dark)]"
                            value={apiBasedApi}
                            onChange={(e) => {
                              setQuizType("apiBased");
                              setApiBasedApi(e.target.value);
                              setApiBasedCourse("");
                              setApiBasedChapter("All");
                              setCourseBasedCourse("");
                              setCourseBasedChapter("All");
                            }}
                          >
                            <option value="">Choose an API</option>
                            {availableApis.map((api) => (
                              <option key={api.id} value={api.id}>
                                {api.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[var(--text-primary)] mb-1">
                            Select Course
                          </label>
                          <select
                            className="w-full p-2 bg-[var(--accent)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-dark)]"
                            value={apiBasedCourse}
                            onChange={(e) => {
                              setApiBasedCourse(e.target.value);
                              setApiBasedChapter("All");
                            }}
                            disabled={
                              !apiBasedApi || apiBasedCourses.length === 0
                            }
                          >
                            <option value="">Choose a Course</option>
                            {apiBasedCourses.map((course) => (
                              <option key={course.name} value={course.name}>
                                {course.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[var(--text-primary)] mb-1">
                            Select Chapter
                          </label>
                          <select
                            className="w-full p-2 bg-[var(--accent)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-dark)]"
                            value={apiBasedChapter}
                            onChange={(e) => setApiBasedChapter(e.target.value)}
                            disabled={
                              !apiBasedCourse || apiBasedChapters.length === 0
                            }
                          >
                            {apiBasedChapters.map((chapter, index) => (
                              <option key={index} value={chapter}>
                                {chapter}
                              </option>
                            ))}
                          </select>
                        </div>
                        {quizType === "apiBased" && (
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={handleCancel}
                              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleStartQuiz}
                              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              disabled={
                                !apiBasedApi || !apiBasedCourse || isLoading
                              }
                            >
                              {isLoading ? "Loading..." : "Start Quiz"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {quizCompleted ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                  Quiz Completed!
                </h3>
                <p className="text-4xl font-bold text-[var(--text-primary)] mb-6 animate-bounce">
                  Your Score: {Math.round(quizScore)}%
                </p>
                <p className="text-lg text-[var(--text-primary)] font-medium mb-4">
                  {getPerformanceMessage(quizScore)}
                </p>
                <p className="text-[var(--text-secondary)] italic mb-6">
                  "{getRecommendation(quizScore)}"
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRetake}
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={handleExit}
                    className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ) : localQuizQuestions.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    Question {localCurrentIndex + 1} of{" "}
                    {localQuizQuestions.length}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="bg-[var(--accent)] text-[var(--text-primary)] px-3 py-1 rounded-full">
                      Score: {Math.round(quizScore)}%
                    </span>
                    <button
                      onClick={handleCancel}
                      className="text-[var(--text-primary)] hover:text-red-500 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="bg-[var(--primary-bg-start)] p-6 rounded-lg border border-[var(--accent)]">
                  <p className="text-lg text-[var(--text-primary)] mb-6 font-medium">
                    {localQuizQuestions[localCurrentIndex]?.question ||
                      "Loading..."}
                  </p>
                  <div className="space-y-4">
                    {localQuizQuestions[localCurrentIndex]?.options?.map(
                      (option, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedOption(index)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedOption === index
                              ? "bg-[var(--accent)] border-[var(--accent-dark)] text-[var(--text-primary)]"
                              : "border-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--text-secondary)]"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePreviousQuestion}
                    className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={localCurrentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={
                      localCurrentIndex < localQuizQuestions.length - 1
                        ? handleNextQuestion
                        : handleSubmitQuiz
                    }
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    disabled={selectedOption === null}
                  >
                    {localCurrentIndex < localQuizQuestions.length - 1
                      ? "Next"
                      : "Finish"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-lg text-[var(--text-secondary)] mb-4">
                  {error || "No questions available for this selection."}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setShowQuiz(false);
                      setLocalQuizQuestions([]);
                      setLocalCurrentIndex(0);
                    }}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Back to Selection
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
