import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import FontSize from "@tiptap/extension-font-size";
// import Color from "@tiptap/extension-color";
// import { TextStyle } from "@tiptap/extension-text-style";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import StreakMotivator from "../components/StreakMotivator";
import QuizModal from "../components/QuizModal";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import StudentStudyingImage from "/images/dashboard-student-studying.png";
// import { TextStyle } from "@tiptap/extension-text-style";
// import { Color } from "@tiptap/extension-color"; // Color comes from extension-colo

const StudentDashboard = () => {
  const {
    user,
    getProgressData,
    getStreak,
    addGoal,
    deleteGoal,
    deleteMultipleGoals,
    getGoals,
    updateProfile,
    getTeacherForCourse,
    mockCourses,
    markGoalAsDone,
    markCourseAsDone,
    markMultipleCoursesAsDone,
    resetQuiz,
  } = useAuth();

  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [newGoalHistory, setNewGoalHistory] = useState([]);
  const [showGoals, setShowGoals] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    school: "",
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isGoalSelectionMode, setIsGoalSelectionMode] = useState(false);
  const [isCourseSelectionMode, setIsCourseSelectionMode] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [showCourses, setShowCourses] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showProgress, setShowProgress] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      TextStyle,
      FontSize.configure({ types: ["textStyle"] }),
      Color.configure({ types: ["textStyle"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setNewGoal(html);
      setNewGoalHistory((prev) => [...prev.slice(-9), html]);
    },
    editorProps: {
      handleDOMEvents: {
        beforeinput: (view, event) => {
          if (event.inputType === "insertText" && event.data === " ") {
            const spaces = " ".repeat(event.data.length || 1);
            view.dispatch(
              view.state.tr.insertText(spaces, view.state.selection.from)
            );
            event.preventDefault();
            return true;
          }
          return false;
        },
        keydown: (view, event) => {
          if (event.key === " ") {
            view.dispatch(
              view.state.tr.insertText(" ", view.state.selection.from)
            );
            return true;
          }
          return false;
        },
        keyup: (__, event) => {
          if (event.key === " ") return true;
          return false;
        },
      },
      attributes: {
        class: "prose focus:outline-none",
        spellcheck: "true",
      },
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchedProgress = getProgressData(user.email, user.userType);
      const fetchedStreak = getStreak(user.email);
      const fetchedGoals = getGoals(user.email);
      const studentCourses = mockCourses.filter((course) =>
        course.students.includes(user.email)
      );

      // Sync progress with courses
      setProgressData(fetchedProgress);
      setStreak(fetchedStreak);
      setGoals(fetchedGoals);
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        gradeLevel: user.gradeLevel,
        school: user.school,
      });
      setCourses(studentCourses);
    }
  }, [user, navigate, getProgressData, getStreak, getGoals, mockCourses]);

  useEffect(() => {
    if (isAddGoalOpen && editor) {
      editor.commands.setContent(newGoal || "");
      editor.commands.focus();
    }
  }, [isAddGoalOpen, editor, newGoal]);

  const handleAddGoal = () => {
    if (newGoal.trim() && newGoal !== "<p></p>") {
      addGoal(user.email, newGoal);
      setGoals(getGoals(user.email));
      setNewGoal("");
      setNewGoalHistory([]);
      setIsAddGoalOpen(false);
      setIsPreviewMode(false);
      setSelectedFontSize("16px");
      setSelectedColor("#000000");
      editor?.commands.setContent("");
    }
  };

  const handleUndo = () => {
    if (newGoalHistory.length > 1) {
      const previousContent = newGoalHistory[newGoalHistory.length - 2];
      setNewGoal(previousContent);
      setNewGoalHistory((prev) => prev.slice(0, -1));
      editor?.commands.setContent(previousContent);
    }
  };

  const handleRedo = () => {
    if (editor?.can().redo()) {
      editor.commands.redo();
    }
  };

  const handleClear = () => {
    setNewGoal("");
    setNewGoalHistory([]);
    setSelectedFontSize("16px");
    setSelectedColor("#000000");
    editor?.commands.setContent("");
  };

  const handleDeleteGoal = (index) => {
    deleteGoal(user.email, index);
    setGoals(getGoals(user.email));
  };

  const handleMarkGoalAsDone = (index) => {
    markGoalAsDone(user.email, index);
    setGoals(getGoals(user.email));
  };

  const handleToggleGoalSelectionMode = () => {
    if (goals.length === 0) {
      setIsGoalSelectionMode(false);
      return;
    }
    setIsGoalSelectionMode(!isGoalSelectionMode);
    setSelectedGoals([]);
  };

  const handleToggleCourseSelectionMode = () => {
    if (courses.length === 0) {
      setIsCourseSelectionMode(false);
      return;
    }
    setIsCourseSelectionMode(!isCourseSelectionMode);
    setSelectedCourses([]);
  };

  const handleSelectGoal = (index) => {
    if (selectedGoals.includes(index)) {
      setSelectedGoals(selectedGoals.filter((i) => i !== index));
    } else {
      setSelectedGoals([...selectedGoals, index]);
    }
  };

  const handleSelectAllGoals = () => {
    if (selectedGoals.length === goals.length) {
      setSelectedGoals([]);
    } else {
      setSelectedGoals(goals.map((_, index) => index));
    }
  };

  const handleDeleteSelectedGoals = () => {
    if (selectedGoals.length > 0) {
      deleteMultipleGoals(user.email, selectedGoals);
      setGoals(getGoals(user.email));
      setSelectedGoals([]);
      setIsGoalSelectionMode(false);
    }
  };

  const handleSelectCourse = (index) => {
    if (selectedCourses.includes(index)) {
      setSelectedCourses(selectedCourses.filter((i) => i !== index));
    } else {
      setSelectedCourses([...selectedCourses, index]);
    }
  };

  const handleSelectAllCourses = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map((_, index) => index));
    }
  };

  const handleMarkSelectedCoursesDone = async () => {
    if (selectedCourses.length > 0) {
      const courseIds = selectedCourses.map((index) => courses[index].id);
      const success = await markMultipleCoursesAsDone(courseIds);

      if (success) {
        setCourses((prev) =>
          prev.map((course, index) =>
            selectedCourses.includes(index) ? { ...course, done: true } : course
          )
        );

        const firstSelectedIndex = selectedCourses[0];
        const firstSelectedCourse = courses[firstSelectedIndex];
        const teacher = getTeacherForCourse(firstSelectedCourse.teacherEmail);
        setSelectedCourse({ ...firstSelectedCourse, teacher });

        setSelectedCourses([]);
        setIsCourseSelectionMode(false);
      }
    }
  };

  const handleMarkCourseDone = async (courseId) => {
    await markCourseAsDone(courseId);
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, done: true } : course
      )
    );
    const course = courses.find((c) => c.id === courseId);
    const teacher = getTeacherForCourse(course.teacherEmail);
    setSelectedCourse({ ...course, teacher });
  };

  const handleEditProfile = () => {
    updateProfile(user.email, profileData);
    setIsEditingProfile(false);
  };

  const handleViewCourseDetails = (course) => {
    const teacher = getTeacherForCourse(course.teacherEmail);
    setSelectedCourse({ ...course, teacher });
  };

  const handleViewChapters = (course) => {
    console.log(`Viewing chapters for ${course.name}`);
    setSelectedCourse({ ...course });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left md:gap-8 px-4 py-8">
          <div className="mb-6">
            <img
              src={StudentStudyingImage}
              alt="Student Studying"
              className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
              onError={() =>
                console.error("Failed to load student studying image")
              }
            />
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-6 md:ml-4 mt-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {user.firstName} {user.lastName}!
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] mt-2">
              {user.gradeLevel}th Grade
            </p>
            <p className="text-lg md:text-xl font-light text-[var(--text-secondary)] mt-2">
              School: {user.school}
            </p>
            <div className="flex gap-4 md:gap-6">
              <Button
                onClick={() => setIsEditingProfile(true)}
                className="mt-4 text-xl md:text-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsAddGoalOpen(true)}
                className="mt-4 text-xl md:text-2xl opacity-100 text-white  bg-[var(--primary-bg-end)] shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Add Goal
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    First Name:
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    Grade Level:
                  </label>
                  <input
                    type="text"
                    value={profileData.gradeLevel}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        gradeLevel: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">
                    School:
                  </label>
                  <input
                    type="text"
                    value={profileData.school}
                    onChange={(e) =>
                      setProfileData({ ...profileData, school: e.target.value })
                    }
                    className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleEditProfile} className="w-full">
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    className="w-full bg-red-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {isAddGoalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-8 rounded-xl max-w-lg w-full shadow-2xl border border-[var(--accent)]">
              <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] border-b pb-2">
                Add a New Goal
              </h2>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-4 bg-[var(--accent)] p-2 rounded-lg shadow-inner">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editor?.isActive("bold")
                        ? "bg-[var(--accent-dark)] text-white"
                        : "bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-dark)]"
                    }`}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editor?.isActive("italic")
                        ? "bg-[var(--accent-dark)] text-white"
                        : "bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-dark)]"
                    }`}
                    disabled={
                      !editor?.can().chain().focus().toggleItalic().run()
                    }
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editor?.isActive("strike")
                        ? "bg-[var(--accent-dark)] text-white"
                        : "bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-dark)]"
                    }`}
                    disabled={
                      !editor?.can().chain().focus().toggleStrike().run()
                    }
                    title="Strikethrough"
                  >
                    <s>S</s>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editor?.isActive("bulletList")
                        ? "bg-[var(--accent-dark)] text-white"
                        : "bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-dark)]"
                    }`}
                    disabled={
                      !editor?.can().chain().focus().toggleBulletList().run()
                    }
                    title="Bullet List"
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editor?.isActive("orderedList")
                        ? "bg-[var(--accent-dark)] text-white"
                        : "bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-dark)]"
                    }`}
                    disabled={
                      !editor?.can().chain().focus().toggleOrderedList().run()
                    }
                    title="Numbered List"
                  >
                    1.
                  </button>
                  <select
                    value={selectedFontSize}
                    onChange={(e) => {
                      setSelectedFontSize(e.target.value);
                      editor?.chain().focus().setFontSize(e.target.value).run();
                    }}
                    className="px-3 py-1 bg-transparent text-[var(--text-primary)] rounded-lg hover:bg-[var(--accent-dark)] transition-colors"
                    title="Font Size"
                  >
                    <option value="12px">12px</option>
                    <option value="16px">16px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                  </select>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      editor?.chain().focus().setColor(e.target.value).run();
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none"
                    title="Text Color"
                  />
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={newGoalHistory.length <= 1}
                    title="Undo"
                  >
                    ↺
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={!editor?.can().redo()}
                    title="Redo"
                  >
                    ↻
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Clear"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title={isPreviewMode ? "Edit" : "Preview"}
                  >
                    {isPreviewMode ? "✎" : "👁️"}
                  </button>
                </div>

                {isPreviewMode ? (
                  <div
                    className="w-full min-h-[150px] bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-4 rounded-lg border border-[var(--accent)] shadow-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: newGoal || "<p>Type your goal here...</p>",
                    }}
                  />
                ) : (
                  <EditorContent
                    editor={editor}
                    className="w-full min-h-[150px] bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-4 rounded-lg border border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] shadow-sm"
                  />
                )}

                <p className="text-sm text-[var(--text-secondary)]">
                  Characters: {newGoal.replace(/<[^>]+>/g, "").length} / 1000
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddGoal}
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={!newGoal.trim() || newGoal === "<p></p>"}
                  >
                    Save Goal
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddGoalOpen(false);
                      setNewGoal("");
                      setNewGoalHistory([]);
                      setIsPreviewMode(false);
                      setSelectedFontSize("16px");
                      setSelectedColor("#000000");
                      editor?.commands.setContent("");
                    }}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <section className="mb-12 mt-20 ">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Progress
          </h2>
          <div className="shadow-lg  transform transition-all duration-300 hover:scale-105 max-w-4xl mx-auto bg-[var(--primary-bg-end)] rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold p-6">Current Progress</h3>
              <div className="flex items-center  justify-end  pl-6 pt-6 pr-6 pb-9">
                <Button
                  onClick={() => setShowProgress(!showProgress)}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                >
                  {showProgress ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            {showProgress && (
              <div
                className=" p-6
"
              >
                {progressData.length > 0 ? (
                  progressData.map((data, index) => (
                    <ProgressBar
                      key={index}
                      subject={data.subject}
                      percentage={data.percentage}
                    />
                  ))
                ) : (
                  <p className="text-center text-[var(--text-secondary)]">
                    No progress data available.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Courses Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Courses
          </h2>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg  transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Current Courses</h3>
              <div className="flex gap-2">
                {showCourses && (
                  <Button
                    onClick={handleToggleCourseSelectionMode}
                    className={`${
                      isCourseSelectionMode
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                    }`}
                  >
                    {isCourseSelectionMode ? "Cancel" : "See More"}
                  </Button>
                )}
                <Button
                  onClick={() => setShowCourses(!showCourses)}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                >
                  {showCourses ? "Hide" : "View"}
                </Button>
              </div>
            </div>

            {isCourseSelectionMode && (
              <div className="mb-4 flex gap-2">
                <Button
                  onClick={handleSelectAllCourses}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {selectedCourses.length === courses.length
                    ? "Cancel All"
                    : "Select All"}
                </Button>
                {selectedCourses.length > 0 && (
                  <Button
                    onClick={handleMarkSelectedCoursesDone}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark as Done ({selectedCourses.length})
                  </Button>
                )}
              </div>
            )}

            {showCourses && (
              <>
                {courses.length > 0 ? (
                  <ul className="space-y-2">
                    {courses.map((course, index) => (
                      <li
                        key={course.id}
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          selectedCourses.includes(index)
                            ? "bg-[var(--accent)] text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        } ${course.done ? "line-through opacity-75" : ""}`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {isCourseSelectionMode && (
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(index)}
                              onChange={() => handleSelectCourse(index)}
                              className="w-5 h-5"
                            />
                          )}
                          <span
                            onClick={() =>
                              !isCourseSelectionMode &&
                              handleViewCourseDetails(course)
                            }
                            className={`flex-1 ${
                              !isCourseSelectionMode
                                ? "cursor-pointer hover:text-[var(--accent)]"
                                : ""
                            }`}
                          >
                            {course.name}
                          </span>
                        </div>
                        {!isCourseSelectionMode && (
                          <div className="flex gap-2 items-center">
                            <Button
                              onClick={() => handleMarkCourseDone(course.id)}
                              className={`text-sm px-2 py-1 ${
                                course.done
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                              disabled={course.done}
                            >
                              Done
                            </Button>
                            <Button
                              onClick={() => handleViewChapters(course)}
                              className="bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1"
                            >
                              Chapters
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-[var(--text-secondary)]">
                    You are not enrolled in any courses.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{selectedCourse.name}</h2>
              <p className="mb-2">
                <strong>Teacher:</strong>{" "}
                {selectedCourse.teacher
                  ? `${selectedCourse.teacher.firstName} ${selectedCourse.teacher.lastName} (${selectedCourse.teacher.role})`
                  : "Unknown"}
              </p>
              <p className="mb-4">
                <strong>School:</strong>{" "}
                {selectedCourse.teacher
                  ? selectedCourse.teacher.school
                  : "Unknown"}
              </p>
              <Button
                onClick={() => setSelectedCourse(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Goals Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Your Goals
          </h2>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg  transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Current Goals</h3>
              <div className="flex gap-2">
                {showGoals && (
                  <Button
                    onClick={handleToggleGoalSelectionMode}
                    className={`${
                      isGoalSelectionMode
                        ? "bg-red-5s00 hover:bg-red-600"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                    }`}
                  >
                    {isGoalSelectionMode ? "Cancel" : "Select"}
                  </Button>
                )}
                <Button
                  onClick={() => setShowGoals(!showGoals)}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
                >
                  {showGoals ? "Hide" : "View"}
                </Button>
              </div>
            </div>

            {isGoalSelectionMode && (
              <div className="mb-4 flex gap-2">
                <Button
                  onClick={handleSelectAllGoals}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {selectedGoals.length === goals.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                {selectedGoals.length > 0 && (
                  <Button
                    onClick={handleDeleteSelectedGoals}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Selected ({selectedGoals.length})
                  </Button>
                )}
              </div>
            )}

            {showGoals && (
              <>
                {goals.length > 0 ? (
                  <ul className="space-y-2">
                    {goals.map((goal, index) => (
                      <li
                        key={index}
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          selectedGoals.includes(index)
                            ? "bg-[var(--accent)] text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        } ${goal.done ? "line-through opacity-75" : ""}`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {isGoalSelectionMode && (
                            <input
                              type="checkbox"
                              checked={selectedGoals.includes(index)}
                              onChange={() => handleSelectGoal(index)}
                              className="w-5 h-5"
                            />
                          )}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: goal.content || goal,
                            }}
                            className="flex-1 prose prose-sm max-w-none"
                          />
                        </div>
                        {!isGoalSelectionMode && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleMarkGoalAsDone(index)}
                              className={`text-sm px-2 py-1 ${
                                goal.done
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                              disabled={goal.done}
                            >
                              Done
                            </Button>
                            <Button
                              onClick={() => handleDeleteGoal(index)}
                              className="bg-red-500 hover:bg-red-600 text-sm px-2 py-1"
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-[var(--text-secondary)]">
                    No goals set yet.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Streak and Quiz Sections */}
        <section className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <StreakMotivator streak={streak} />
          </div>
          <div className="flex-1 bg-[var(--primary-bg-end)] p-6 rounded-lg text-center shadow-lg  transform transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold mb-4">Daily Quiz Challenge</h3>
            <Button onClick={() => setIsQuizOpen(true)}>Take a Quiz</Button>
          </div>
        </section>
      </main>
      <Footer />
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false);
          resetQuiz();
          // Refresh progress data after quiz completion to include quiz score
          setProgressData(getProgressData(user.email, user.userType));
        }}
      />
    </div>
  );
};

export default StudentDashboard;
