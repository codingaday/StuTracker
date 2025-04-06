import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import TeacherTeachingImage from "/images/dashboard-teacher-teaching.png";
import {
  FiTrash2,
  FiBookOpen,
  FiSettings,
  FiUserPlus,
  FiCopy,
  FiClipboard,
  FiEdit,
  FiCheck,
  FiSearch,
  FiDownload,
  FiUpload,
} from "react-icons/fi";

const TeacherDashboard = () => {
  const {
    user,
    getProgressData,
    getCourses,
    addCourse,
    deleteCourse,
    deleteMultipleCourses,
    addStudentToCourse,
    removeStudentFromCourse,
    getStudentsInCourse,
    getStudentProgressForCourse,
    updateProfile,
    mockCourses,
    mockUsers,
    isStudentRegistered,
    enrollStudentsToCourses,
  } = useAuth();

  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isCourseActionsOpen, setIsCourseActionsOpen] = useState(false);
  const [isStudentActionsOpen, setIsStudentActionsOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showStudents, setShowStudents] = useState(true);
  const [showOverallStatus, setShowOverallStatus] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedEmails, setSuggestedEmails] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourseAction, setSelectedCourseAction] = useState(null);
  const [selectedStudentAction, setSelectedStudentAction] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [multiEnrollEmails, setMultiEnrollEmails] = useState("");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [expandedStudentEmail, setExpandedStudentEmail] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedCourseName, setCopiedCourseName] = useState("");
  const [copiedStudentEmails, setCopiedStudentEmails] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourseName, setEditedCourseName] = useState("");
  const [sortOrderStudents, setSortOrderStudents] = useState("asc");
  const [sortOrderCourses, setSortOrderCourses] = useState("asc");
  const [overallSortOrderStudents, setOverallSortOrderStudents] =
    useState("asc");
  const [overallSortOrderCourses, setOverallSortOrderCourses] = useState("asc");
  const [isExporting, setIsExporting] = useState(false);
  const [studentFilter, setStudentFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchedProgress = getProgressData(user.email, user.userType);
      const fetchedCourses = getCourses(user.email);
      setProgressData(fetchedProgress);
      setCourses(fetchedCourses);
      setEditProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      const studentEmails = mockUsers
        .filter((u) => u.userType === "student")
        .map((u) => u.email);
      setSuggestedEmails(studentEmails);
    }
  }, [user, navigate, getProgressData, getCourses, mockUsers]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/json",
      "text/plain",
      "text/csv",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid file type (PDF, JSON, TXT, or CSV)");
      return;
    }
    if (file.size > maxSize) {
      alert("File size exceeds 10MB limit");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    if (file.type === "application/pdf") {
      setFilePreview(URL.createObjectURL(file));
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadCourse = () => {
    if (!newCourseName.trim()) {
      alert("Please enter a course name");
      return;
    }

    addCourse(newCourseName, user.email);
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      console.log("File content preview:", filePreview);
    }

    setNewCourseName("");
    setSelectedFile(null);
    setFilePreview(null);
    setFileName("");
    setIsAddCourseOpen(false);
    setCourses(getCourses(user.email));
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setCourseStudents(getStudentsInCourse(courseId));
    setSelectedStudent(null);
    setSelectedStudents([]);
    setShowStudents(true);
    setExpandedStudentEmail(null);
  };

  const handleViewStudentProgress = (student) => {
    setSelectedStudent(
      selectedStudent?.email === student.email ? null : student
    );
  };

  const handleAddStudent = async () => {
    if (!newStudentEmail.trim() || !selectedCourse) return;

    if (!isStudentRegistered(newStudentEmail)) {
      alert("Student not found. Please ask them to create an account first.");
      return;
    }

    try {
      await addStudentToCourse(selectedCourse, newStudentEmail);
      setCourseStudents(getStudentsInCourse(selectedCourse));
      setNewStudentEmail("");
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  const handleRemoveStudent = async (studentEmail) => {
    if (!selectedCourse) return;

    try {
      await removeStudentFromCourse(selectedCourse, studentEmail);
      setCourseStudents(getStudentsInCourse(selectedCourse));
      if (selectedStudent?.email === studentEmail) setSelectedStudent(null);
      setSelectedStudents((prev) =>
        prev.filter((email) => email !== studentEmail)
      );
      if (expandedStudentEmail === studentEmail) setExpandedStudentEmail(null);
    } catch (error) {
      console.error("Failed to remove student:", error);
      alert("Failed to remove student. Please try again.");
    }
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleStudentSelection = (studentEmail) => {
    setSelectedStudents((prev) =>
      prev.includes(studentEmail)
        ? prev.filter((email) => email !== studentEmail)
        : [...prev, studentEmail]
    );
  };

  const handleSelectAllCourses = () => {
    const allCourseIds = courses.map((course) => course.id);
    setSelectedCourses(
      selectedCourses.length === allCourseIds.length ? [] : allCourseIds
    );
    setSelectedCourseAction("selectallcourses");
    setIsCourseActionsOpen(false);
  };

  const handleSelectAllStudents = () => {
    const allStudentEmails = courseStudents.map((student) => student.email);
    setSelectedStudents(
      selectedStudents.length === allStudentEmails.length
        ? []
        : allStudentEmails
    );
    setSelectedStudentAction("selectallstudents");
    setIsStudentActionsOpen(false);
  };

  const handleDeleteSelectedCourses = async () => {
    if (selectedCourses.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCourses.length} selected course(s)?`
      )
    ) {
      try {
        await deleteMultipleCourses(selectedCourses);
        setCourses(getCourses(user.email));
        setProgressData(getProgressData(user.email, user.userType));
        if (selectedCourses.includes(selectedCourse)) {
          setSelectedCourse(null);
          setCourseStudents([]);
          setSelectedStudents([]);
          setExpandedStudentEmail(null);
        }
        setSelectedCourses([]);
        setSelectedCourseAction("deleteselectedcourses");
        setIsCourseActionsOpen(false);
      } catch (error) {
        console.error("Error deleting courses:", error);
        alert("Failed to delete courses. Please try again.");
      }
    }
  };

  const handleDeleteSingleCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
        setCourses(getCourses(user.email));
        setProgressData(getProgressData(user.email, user.userType));
        if (selectedCourse === courseId) {
          setSelectedCourse(null);
          setCourseStudents([]);
          setSelectedStudents([]);
          setExpandedStudentEmail(null);
        }
        setSelectedCourseAction("deletecourse");
        setIsCourseActionsOpen(false);
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  const handleDeleteSelectedStudents = async () => {
    if (selectedStudents.length === 0 || !selectedCourse) return;

    if (
      window.confirm(
        `Are you sure you want to remove ${selectedStudents.length} selected student(s)?`
      )
    ) {
      try {
        await Promise.all(
          selectedStudents.map((email) =>
            removeStudentFromCourse(selectedCourse, email)
          )
        );
        setCourseStudents(getStudentsInCourse(selectedCourse));
        setSelectedStudents([]);
        setSelectedStudent(null);
        setSelectedStudentAction("deleteselectedstudents");
        setIsStudentActionsOpen(false);
      } catch (error) {
        console.error("Failed to remove students:", error);
        alert("Failed to remove students. Please try again.");
      }
    }
  };

  const filteredStudents = courseStudents
    .filter((student) =>
      `${student.firstName} ${student.lastName} ${student.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrderStudents === "asc"
        ? a.lastName.localeCompare(b.lastName)
        : b.lastName.localeCompare(a.lastName)
    );

  const handleMultiEnroll = async () => {
    if (selectedCourses.length === 0 || !multiEnrollEmails.trim()) {
      alert("Please select at least one course and enter student emails");
      return;
    }

    const emails = multiEnrollEmails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const invalidEmails = emails.filter((email) => !isStudentRegistered(email));

    if (invalidEmails.length > 0) {
      alert(
        `These emails are not registered: ${invalidEmails.join(
          ", "
        )}. Please ask them to sign up.`
      );
      return;
    }

    try {
      await enrollStudentsToCourses(emails, selectedCourses);
      setMultiEnrollEmails("");
      setSelectedCourses([]);
      setCourses(getCourses(user.email));
      if (selectedCourse)
        setCourseStudents(getStudentsInCourse(selectedCourse));
      setSelectedCourseAction("multienroll");
      setIsCourseActionsOpen(false);
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to enroll students. Please try again.");
    }
  };

  const handleEmailInputChange = (e) => {
    setNewStudentEmail(e.target.value);
  };

  const handlePasteStudentEmail = () => {
    if (copiedStudentEmails)
      setNewStudentEmail(copiedStudentEmails.split(", ")[0]);
  };

  const getStudentCourses = (studentEmail) =>
    courses
      .filter((course) => course.students.includes(studentEmail))
      .sort((a, b) =>
        sortOrderCourses === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );

  const getOverallCoursesStatus = () => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter((course) => course.done).length;
    const totalStudentsEnrolled = new Set(
      courses.flatMap((course) => course.students)
    ).size;
    const completionRate =
      totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

    const totalCurrentStudents = totalStudentsEnrolled;
    const allStudentsEver = new Set(
      mockCourses.flatMap((course) => course.students)
    ).size;
    const totalCoursesEver = mockCourses.length;

    let filteredCourses = [...courses].sort((a, b) =>
      overallSortOrderCourses === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    switch (statusFilter) {
      case "completed":
        filteredCourses = filteredCourses.filter((course) => course.done);
        break;
      case "inProgress":
        filteredCourses = filteredCourses.filter((course) => !course.done);
        break;
      case "recent":
        filteredCourses = filteredCourses
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        break;
      case "core":
        filteredCourses = filteredCourses.filter(
          (course) => course.type === "Core"
        );
        break;
      case "elective":
        filteredCourses = filteredCourses.filter(
          (course) => course.type === "Elective"
        );
        break;
      default:
        break;
    }

    const enrolledStudentEmails = new Set(
      courses.flatMap((course) => course.students)
    );
    const allStudents = mockUsers.filter((u) => u.userType === "student");
    let filteredStudents;

    switch (studentFilter) {
      case "enrolled":
        filteredStudents = allStudents.filter((student) =>
          enrolledStudentEmails.has(student.email)
        );
        break;
      case "notEnrolled":
        filteredStudents = allStudents.filter(
          (student) => !enrolledStudentEmails.has(student.email)
        );
        break;
      case "all":
        filteredStudents = allStudents;
        break;
      default:
        filteredStudents = allStudents;
    }

    filteredStudents = filteredStudents.sort((a, b) =>
      overallSortOrderStudents === "asc"
        ? a.lastName.localeCompare(b.lastName)
        : b.lastName.localeCompare(a.lastName)
    );

    return {
      totalCourses,
      completedCourses,
      totalStudentsEnrolled,
      completionRate: completionRate.toFixed(2),
      totalCurrentStudents,
      totalStudentsSoFar: allStudentsEver,
      totalCoursesSoFar: totalCoursesEver,
      filteredCourses,
      filteredStudents,
    };
  };

  const handleCopyCourseName = (courseId) => {
    const courseName = courses.find((c) => c.id === courseId).name;
    setCopiedCourseName(courseName);
    navigator.clipboard.writeText(courseName);
    setSelectedCourseAction("copycoursename");
    setIsCourseActionsOpen(false);
  };

  const handleCopyMultipleCourseNames = () => {
    const courseNames = selectedCourses
      .map((id) => courses.find((c) => c.id === id).name)
      .join(", ");
    setCopiedCourseName(courseNames);
    navigator.clipboard.writeText(courseNames);
    setSelectedCourseAction("copyselectedcoursenames");
    setIsCourseActionsOpen(false);
  };

  const handleCopyStudentEmail = (studentEmail) => {
    setCopiedStudentEmails(studentEmail);
    navigator.clipboard.writeText(studentEmail);
    setSelectedStudentAction("copyemail");
    setIsStudentActionsOpen(false);
  };

  const handleCopyStudentName = (studentEmail) => {
    const student = courseStudents.find((s) => s.email === studentEmail);
    const name = `${student.firstName} ${student.lastName}`;
    navigator.clipboard.writeText(name);
    setSelectedStudentAction("copyname");
    setIsStudentActionsOpen(false);
  };

  const handleCopyMultipleStudentNames = () => {
    const names = selectedStudents
      .map((email) => {
        const student = courseStudents.find((s) => s.email === email);
        return `${student.firstName} ${student.lastName}`;
      })
      .join(", ");
    navigator.clipboard.writeText(names);
    setSelectedStudentAction("copymorenames");
    setIsStudentActionsOpen(false);
  };

  const handleCopyMultipleStudentEmails = () => {
    const emails = selectedStudents.join(", ");
    setCopiedStudentEmails(emails);
    navigator.clipboard.writeText(emails);
    setSelectedStudentAction("copyemails");
    setIsStudentActionsOpen(false);
  };

  const handleCopyAllStudentEmails = () => {
    const allEmails = courseStudents.map((s) => s.email).join(", ");
    setCopiedStudentEmails(allEmails);
    navigator.clipboard.writeText(allEmails);
    setSelectedStudentAction("copyallemails");
    setIsStudentActionsOpen(false);
  };

  const handleCopyAllStudentNames = () => {
    const allNames = courseStudents
      .map((s) => `${s.firstName} ${s.lastName}`)
      .join(", ");
    navigator.clipboard.writeText(allNames);
    setSelectedStudentAction("copyallnames");
    setIsStudentActionsOpen(false);
  };

  const handlePasteCourseName = () => {
    if (copiedCourseName) setNewCourseName(copiedCourseName);
  };

  const handleEditCourseName = (courseId, currentName) => {
    setEditingCourseId(courseId);
    setEditedCourseName(currentName);
  };

  const handleSaveEdit = (courseId) => {
    if (editedCourseName.trim()) {
      const updatedCourses = mockCourses.map((course) =>
        course.id === courseId
          ? { ...course, name: editedCourseName.trim() }
          : course
      );
      localStorage.setItem("mockCourses", JSON.stringify(updatedCourses));
      setCourses(getCourses(user.email));
      setEditingCourseId(null);
      setEditedCourseName("");
      setSelectedCourseAction("renamecourse");
      setIsCourseActionsOpen(false);
    }
  };

  const handleExportCourses = () => {
    setIsExporting(true);
    const csvContent = [
      "Course Name,Type,Students,Status",
      ...courses.map(
        (course) =>
          `${course.name},${course.type},${course.students.length},${
            course.done ? "Completed" : "In Progress"
          }`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "courses_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleExportOverallStatus = () => {
    setIsExporting(true);
    const overallStatus = getOverallCoursesStatus();
    const csvContent = [
      "First Name,Last Name,Email,Status",
      ...overallStatus.filteredStudents.map(
        (student) =>
          `${student.firstName},${student.lastName},${student.email},${
            courses.some((c) => c.students.includes(student.email))
              ? "Enrolled"
              : "Not Enrolled"
          }`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "overall_students_status_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleExportProgress = () => {
    setIsExporting(true);
    const csvContent = [
      "Subject,Percentage",
      ...progressData.map((data) => `${data.subject},${data.percentage}`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "class_progress_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleExportStudents = () => {
    setIsExporting(true);
    const csvContent = [
      "First Name,Last Name,Email",
      ...filteredStudents.map(
        (student) => `${student.firstName},${student.lastName},${student.email}`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `students_in_${
      courses.find((c) => c.id === selectedCourse)?.name
    }_export.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const renderCourseActionsMenu = () => (
    <div className="absolute right-0 mt-2 w-64 bg-[var(--primary-bg-end)] rounded-lg shadow-xl z-10 border border-[var(--accent)]">
      {[
        { label: "Select All Courses", action: handleSelectAllCourses },
        {
          label: "Enroll Students",
          action: handleMultiEnroll,
          disabled: selectedCourses.length === 0 || !multiEnrollEmails.trim(),
        },
        {
          label: "Copy Selected Course Names",
          action: handleCopyMultipleCourseNames,
          disabled: selectedCourses.length === 0,
        },
        {
          label: "Rename Course",
          action: () =>
            selectedCourses.length === 1 &&
            handleEditCourseName(
              selectedCourses[0],
              courses.find((c) => c.id === selectedCourses[0]).name
            ),
          disabled: selectedCourses.length !== 1,
        },
        {
          label: "Copy Course Name",
          action: () =>
            selectedCourses.length === 1 &&
            handleCopyCourseName(selectedCourses[0]),
          disabled: selectedCourses.length !== 1,
        },
        {
          label: "Delete Course",
          action: () =>
            selectedCourses.length === 1 &&
            handleDeleteSingleCourse(selectedCourses[0]),
          disabled: selectedCourses.length !== 1,
        },
        {
          label: "Delete Selected Courses",
          action: handleDeleteSelectedCourses,
          disabled: selectedCourses.length === 0,
        },
        { label: "Export Courses", action: handleExportCourses },
      ].map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          disabled={item.disabled}
          className={`block w-full text-left px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-all duration-150 ${
            item.disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
        >
          {selectedCourseAction ===
            item.label.toLowerCase().replace(/\s+/g, "") && (
            <FiCheck className="inline mr-2" />
          )}
          {item.label}
        </button>
      ))}
    </div>
  );

  const renderStudentActionsMenu = () => (
    <div className="absolute right-0 mt-2 w-64 bg-[var(--primary-bg-end)] rounded-lg shadow-xl z-10 border border-[var(--accent)]">
      {[
        { label: "Select All Students", action: handleSelectAllStudents },
        {
          label: "Copy Email",
          action: () =>
            selectedStudents.length === 1 &&
            handleCopyStudentEmail(selectedStudents[0]),
          disabled: selectedStudents.length !== 1,
        },
        {
          label: "Copy Name",
          action: () =>
            selectedStudents.length === 1 &&
            handleCopyStudentName(selectedStudents[0]),
          disabled: selectedStudents.length !== 1,
        },
        {
          label: "Copy Selected Names",
          action: handleCopyMultipleStudentNames,
          disabled: selectedStudents.length === 0,
        },
        {
          label: "Copy Selected Emails",
          action: handleCopyMultipleStudentEmails,
          disabled: selectedStudents.length === 0,
        },
        {
          label: "Copy All Emails",
          action: handleCopyAllStudentEmails,
          disabled: courseStudents.length === 0,
        },
        {
          label: "Copy All Names",
          action: handleCopyAllStudentNames,
          disabled: courseStudents.length === 0,
        },
        {
          label: "Remove Selected",
          action: handleDeleteSelectedStudents,
          disabled: selectedStudents.length === 0,
        },
        { label: "Export Students", action: handleExportStudents },
      ].map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          disabled={item.disabled}
          className={`block w-full text-left px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-all duration-150 ${
            item.disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
        >
          {selectedStudentAction ===
            item.label.toLowerCase().replace(/\s+/g, "") && (
            <FiCheck className="inline mr-2" />
          )}
          {item.label}
        </button>
      ))}
    </div>
  );

  const overallStatus = getOverallCoursesStatus();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-bg-start)]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left md:gap-8 px-4 py-8">
          <div className="mb-6">
            <img
              src={TeacherTeachingImage}
              alt="Teacher Teaching"
              className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
            />
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-6 md:ml-4 mt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Welcome, {user.firstName} {user.lastName}!
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] mt-2">
              {user.role}
            </p>
            <p className="text-lg md:text-xl font-light text-[var(--text-secondary)] mt-2">
              School: {user.school}
            </p>
            <div className="flex gap-4 md:gap-6">
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="mt-4 text-lg md:text-xl shadow-lg transform transition-all duration-300 hover:scale-105 bg-[var(--accent)] hover:bg-cyan-500"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsAddCourseOpen(true)}
                className="mt-4 text-lg md:text-xl opacity-100 text-white bg-[var(--primary-bg-end)] shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Add Course
              </Button>
            </div>
          </div>
        </div>

        {/* Add Course Modal */}
        {isAddCourseOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
            <div className="bg-[var(--primary-bg-end)] rounded-xl max-w-lg w-full p-8 shadow-2xl border border-[var(--accent)]">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Create New Course
                </h2>
                <button
                  onClick={() => setIsAddCourseOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="courseName"
                    className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                  >
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Enter course name"
                    className="w-full px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handlePasteCourseName}
                    className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center"
                    disabled={!copiedCourseName}
                  >
                    <FiClipboard className="mr-2" /> Paste Course Name
                  </Button>
                  <Button
                    onClick={() =>
                      navigator.clipboard
                        .readText()
                        .then((text) => setNewCourseName(text))
                    }
                    className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiCopy className="mr-2" /> Paste from Clipboard
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Upload Course Material (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-[var(--accent)] rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.json,.txt,.csv"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FiUpload className="mx-auto h-12 w-12 text-[var(--text-secondary)]" />
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      Drag and drop or{" "}
                      <span className="text-[var(--accent)] hover:underline">
                        click to upload
                      </span>
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      PDF, JSON, TXT, or CSV (max 10MB)
                    </p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="border border-[var(--accent)] rounded-lg p-4 flex items-center justify-between bg-[var(--primary-bg-start)]">
                    <div className="flex items-center space-x-3">
                      <FiFile className="h-8 w-8 text-[var(--accent)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {fileName}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
                {filePreview && (
                  <div className="mt-4 p-4 bg-[var(--primary-bg-start)] rounded-lg max-h-40 overflow-y-auto">
                    {selectedFile.type === "application/pdf" ? (
                      <a
                        href={filePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline"
                      >
                        View PDF Preview
                      </a>
                    ) : (
                      <pre className="text-xs text-[var(--text-secondary)]">
                        {filePreview.substring(0, 500)}...
                      </pre>
                    )}
                  </div>
                )}
                <div className="flex gap-4">
                  <Button
                    onClick={handleUploadCourse}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
                  >
                    Create Course
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddCourseOpen(false);
                      handleRemoveFile();
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
            <div className="bg-[var(--primary-bg-end)] rounded-xl max-w-lg w-full p-8 shadow-2xl border border-[var(--accent)]">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editProfileData.firstName}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editProfileData.lastName}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editProfileData.email}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={editProfileData.phone}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={editProfileData.bio}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        bio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    rows="4"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await updateProfile(
                          editProfileData.email,
                          editProfileData
                        );
                        setIsEditProfileOpen(false);
                      } catch (error) {
                        console.error("Failed to update profile:", error);
                        alert("Failed to update profile. Please try again.");
                      }
                    }}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Courses Status Section */}
        <section className="mb-12">
          <div className="shadow-lg transform transition-all duration-300 hover:scale-105 max-w-5xl mx-auto bg-[var(--primary-bg-end)] rounded-lg">
            <div className="flex justify-between items-center p-6 border-b border-[var(--accent)]">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                Overall Courses Status
              </h2>
              <div className="flex gap-4">
                <Button
                  onClick={handleExportOverallStatus}
                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center"
                  disabled={isExporting}
                >
                  <FiDownload className="mr-2" /> Export Students
                </Button>
                <Button
                  onClick={() => setShowOverallStatus(!showOverallStatus)}
                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {showOverallStatus ? "Hide" : "View"}
                </Button>
              </div>
            </div>
            {showOverallStatus && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Total Current Courses
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {overallStatus.totalCourses}
                    </p>
                  </div>
                  <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Total Courses So Far
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {overallStatus.totalCoursesSoFar}
                    </p>
                  </div>
                  <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Completed Courses
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {overallStatus.completedCourses}
                    </p>
                  </div>
                  <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Total Current Students
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {overallStatus.totalCurrentStudents}
                    </p>
                  </div>
                  <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Total Students So Far
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {overallStatus.totalStudentsSoFar}
                    </p>
                  </div>
                  <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Completion Rate
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {overallStatus.completionRate}%
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {/* Course Filtering */}
                  <div className="flex items-center gap-4">
                    <label className="text-[var(--text-primary)] font-medium">
                      Filter Courses:
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="all">All Courses</option>
                      <option value="completed">Completed</option>
                      <option value="inProgress">In Progress</option>
                      <option value="recent">Recent Courses</option>
                      <option value="core">Core Courses</option>
                      <option value="elective">Elective Courses</option>
                    </select>
                    <select
                      value={overallSortOrderCourses}
                      onChange={(e) =>
                        setOverallSortOrderCourses(e.target.value)
                      }
                      className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="asc">Sort Courses A-Z</option>
                      <option value="desc">Sort Courses Z-A</option>
                    </select>
                  </div>
                  {overallStatus.filteredCourses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[var(--primary-bg-start)]">
                            <th className="p-3 text-[var(--text-primary)]">
                              Name
                            </th>
                            <th className="p-3 text-[var(--text-primary)]">
                              Type
                            </th>
                            <th className="p-3 text-[var(--text-primary)]">
                              Students
                            </th>
                            <th className="p-3 text-[var(--text-primary)]">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {overallStatus.filteredCourses.map((course) => (
                            <tr
                              key={course.id}
                              className="border-b border-[var(--accent)] hover:bg-[var(--accent)]"
                            >
                              <td className="p-3 text-[var(--text-secondary)]">
                                <Link
                                  to={`/course/${course.id}`}
                                  className="text-[var(--accent)] hover:underline"
                                >
                                  {course.name}
                                </Link>
                              </td>
                              <td className="p-3 text-[var(--text-secondary)]">
                                {course.type}
                              </td>
                              <td className="p-3 text-[var(--text-secondary)]">
                                {course.students.length}
                              </td>
                              <td className="p-3 text-[var(--text-secondary)]">
                                {course.done ? "Completed" : "In Progress"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-[var(--text-secondary)] py-4">
                      No courses match the current filter.
                    </p>
                  )}

                  {/* Student Filtering */}
                  <div className="flex items-center gap-4">
                    <label className="text-[var(--text-primary)] font-medium">
                      Filter Students:
                    </label>
                    <select
                      value={studentFilter}
                      onChange={(e) => setStudentFilter(e.target.value)}
                      className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="enrolled">Enrolled Students</option>
                      <option value="notEnrolled">Not Enrolled Students</option>
                      <option value="all">All Students</option>
                    </select>
                    <select
                      value={overallSortOrderStudents}
                      onChange={(e) =>
                        setOverallSortOrderStudents(e.target.value)
                      }
                      className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="asc">Sort Students A-Z</option>
                      <option value="desc">Sort Students Z-A</option>
                    </select>
                  </div>
                  {overallStatus.filteredStudents.length > 0 ? (
                    <div className="overflow-x-auto bg-[var(--primary-bg-start)] p-4 rounded-lg shadow-inner">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[var(--primary-bg-start)]">
                            <th className="p-3 text-[var(--text-primary)]">
                              Name
                            </th>
                            <th className="p-3 text-[var(--text-primary)]">
                              Email
                            </th>
                            <th className="p-3 text-[var(--text-primary)]">
                              Status
                            </th>
                            <th className="p-3 text-[var(--text-primary)]">
                              Enrolled Courses
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {overallStatus.filteredStudents.map((student) => (
                            <tr
                              key={student.email}
                              className="border-b border-[var(--accent)] hover:bg-[var(--accent)]"
                            >
                              <td className="p-3 text-[var(--text-primary)]">
                                <Link
                                  to={`/student/${student.email}`}
                                  className="hover:text-[var(--accent)]"
                                >
                                  {student.firstName} {student.lastName}
                                </Link>
                              </td>
                              <td className="p-3 text-[var(--text-secondary)]">
                                {student.email}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                                    courses.some((c) =>
                                      c.students.includes(student.email)
                                    )
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {courses.some((c) =>
                                    c.students.includes(student.email)
                                  )
                                    ? "Enrolled"
                                    : "Not Enrolled"}
                                </span>
                              </td>
                              <td className="p-3 text-[var(--text-secondary)]">
                                {getStudentCourses(student.email).length > 0
                                  ? getStudentCourses(student.email)
                                      .map((c) => c.name)
                                      .join(", ")
                                  : "None"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-[var(--text-secondary)] py-4">
                      No students match the current filter.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Class Progress Section */}
        <section className="mb-12">
          <div className="shadow-lg transform transition-all duration-300 hover:scale-105 max-w-5xl mx-auto bg-[var(--primary-bg-end)] rounded-lg">
            <div className="flex justify-between items-center p-6 border-b border-[var(--accent)]">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                Class Progress
              </h2>
              <div className="flex gap-4">
                <Button
                  onClick={handleExportProgress}
                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center"
                  disabled={isExporting}
                >
                  <FiDownload className="mr-2" /> Export
                </Button>
                <Button
                  onClick={() => setShowProgress(!showProgress)}
                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {showProgress ? "Hide" : "View"}
                </Button>
              </div>
            </div>
            {showProgress && (
              <div className="p-6 space-y-4">
                {progressData.length > 0 ? (
                  progressData.map((data, index) => (
                    <div
                      key={index}
                      className="bg-[var(--primary-bg-start)] p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <Link
                          to={`/progress/${data.subject}`}
                          className="text-[var(--text-primary)] font-medium hover:text-[var(--accent)]"
                        >
                          {data.subject}
                        </Link>
                        <span className="text-[var(--text-secondary)]">
                          {data.percentage}%
                        </span>
                      </div>
                      <ProgressBar
                        subject={data.subject}
                        percentage={data.percentage}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[var(--text-secondary)] py-4">
                    No progress data available.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Course Management Section */}
        <section className="max-w-5xl mx-auto mb-12">
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--accent)] pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                Course Management
              </h2>
              <div className="flex gap-4">
                {showCourses && (
                  <div className="relative">
                    <Button
                      onClick={() =>
                        setIsCourseActionsOpen(!isCourseActionsOpen)
                      }
                      className={`bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                        isCourseActionsOpen ? "bg-red-500 hover:bg-red-600" : ""
                      }`}
                    >
                      {isCourseActionsOpen ? "Cancel" : "Select"}
                    </Button>
                    {isCourseActionsOpen && renderCourseActionsMenu()}
                  </div>
                )}
                <Button
                  onClick={() => {
                    setShowCourses(!showCourses);
                    setIsCourseActionsOpen(false);
                    setSelectedCourses([]);
                  }}
                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {showCourses ? "Hide" : "View"}
                </Button>
              </div>
            </div>
            {showCourses && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={multiEnrollEmails}
                    onChange={(e) => setMultiEnrollEmails(e.target.value)}
                    placeholder="Enter student emails (comma-separated)"
                    className="flex-1 px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  <Button
                    onClick={handleMultiEnroll}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    disabled={
                      selectedCourses.length === 0 || !multiEnrollEmails.trim()
                    }
                  >
                    Enroll Selected
                  </Button>
                </div>
                {courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[var(--primary-bg-start)]">
                          <th className="p-3 w-12"></th>
                          <th className="p-3 text-[var(--text-primary)]">
                            Course Name
                          </th>
                          <th className="p-3 text-[var(--text-primary)]">
                            Students
                          </th>
                          <th className="p-3 text-[var(--text-primary)]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr
                            key={course.id}
                            className={`border-b border-[var(--accent)] hover:bg-[var(--accent)] ${
                              selectedCourses.includes(course.id)
                                ? "bg-[var(--accent)] text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course.id)}
                                onChange={() =>
                                  toggleCourseSelection(course.id)
                                }
                                className="w-5 h-5 accent-[var(--accent)]"
                              />
                            </td>
                            <td className="p-3">
                              {editingCourseId === course.id ? (
                                <input
                                  type="text"
                                  value={editedCourseName}
                                  onChange={(e) =>
                                    setEditedCourseName(e.target.value)
                                  }
                                  onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    handleSaveEdit(course.id)
                                  }
                                  onBlur={() => handleSaveEdit(course.id)}
                                  className="px-2 py-1 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                                />
                              ) : (
                                <Link
                                  to={`/course/${course.id}`}
                                  className="hover:text-[var(--accent)]"
                                >
                                  {course.name}
                                </Link>
                              )}
                            </td>
                            <td className="p-3">{course.students.length}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    navigate(`/course/${course.id}`)
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                                >
                                  <FiBookOpen className="mr-1" /> Read
                                </Button>
                                <Button
                                  onClick={() => handleSelectCourse(course.id)}
                                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-3 py-1 rounded-lg"
                                >
                                  <FiSettings className="mr-1" /> Manage
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-[var(--text-secondary)] py-4">
                    No courses available. Add a course to get started!
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Students Section */}
        {selectedCourse && (
          <section className="max-w-5xl mx-auto mb-12">
            <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--accent)] pb-4">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                  Students in{" "}
                  {courses.find((c) => c.id === selectedCourse)?.name}
                </h2>
                <div className="flex gap-4">
                  {showStudents && (
                    <div className="relative">
                      <Button
                        onClick={() =>
                          setIsStudentActionsOpen(!isStudentActionsOpen)
                        }
                        className={`bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                          isStudentActionsOpen
                            ? "bg-red-500 hover:bg-red-600"
                            : ""
                        }`}
                      >
                        {isStudentActionsOpen ? "Cancel" : "Select"}
                      </Button>
                      {isStudentActionsOpen && renderStudentActionsMenu()}
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setShowStudents(!showStudents);
                      setIsStudentActionsOpen(false);
                      setSelectedStudents([]);
                    }}
                    className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    {showStudents ? "Hide" : "View"}
                  </Button>
                </div>
              </div>
              {showStudents && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={newStudentEmail}
                      onChange={handleEmailInputChange}
                      placeholder="Enter student email"
                      className="flex-1 px-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      list="student-emails"
                    />
                    <datalist id="student-emails">
                      {suggestedEmails.map((email) => (
                        <option key={email} value={email} />
                      ))}
                    </datalist>
                    <Button
                      onClick={handleAddStudent}
                      disabled={
                        !newStudentEmail ||
                        !isStudentRegistered(newStudentEmail)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      <FiUserPlus className="mr-2" /> Add Student
                    </Button>
                    <Button
                      onClick={handlePasteStudentEmail}
                      className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg"
                      disabled={!copiedStudentEmails}
                    >
                      <FiClipboard className="mr-2" /> Paste Email
                    </Button>
                  </div>
                  {newStudentEmail && (
                    <p className="text-sm text-[var(--text-secondary)]">
                      {isStudentRegistered(newStudentEmail) ? (
                        <span className="text-green-500">
                          ✓ Registered student
                        </span>
                      ) : (
                        <span className="text-red-500">
                          ✗ Not registered -{" "}
                          <Link
                            to="/signup"
                            className="underline text-[var(--accent)]"
                          >
                            Sign up
                          </Link>
                        </span>
                      )}
                    </p>
                  )}
                  {courseStudents.length > 0 ? (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search students by name or email..."
                            className="w-full pl-10 pr-4 py-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          />
                        </div>
                        <select
                          value={sortOrderStudents}
                          onChange={(e) => setSortOrderStudents(e.target.value)}
                          className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)]"
                        >
                          <option value="asc">Sort Students A-Z</option>
                          <option value="desc">Sort Students Z-A</option>
                        </select>
                        <select
                          value={sortOrderCourses}
                          onChange={(e) => setSortOrderCourses(e.target.value)}
                          className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)]"
                        >
                          <option value="asc">Sort Courses A-Z</option>
                          <option value="desc">Sort Courses Z-A</option>
                        </select>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[var(--primary-bg-start)]">
                              <th className="p-3 w-12"></th>
                              <th className="p-3 text-[var(--text-primary)]">
                                Name
                              </th>
                              <th className="p-3 text-[var(--text-primary)]">
                                Email
                              </th>
                              <th className="p-3 text-[var(--text-primary)]">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student) => (
                              <tr
                                key={student.email}
                                className={`border-b border-[var(--accent)] hover:bg-[var(--accent)] ${
                                  selectedStudents.includes(student.email)
                                    ? "bg-[var(--accent)] text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)]"
                                }`}
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(
                                      student.email
                                    )}
                                    onChange={() =>
                                      toggleStudentSelection(student.email)
                                    }
                                    className="w-5 h-5 accent-[var(--accent)]"
                                  />
                                </td>
                                <td className="p-3">
                                  <Link
                                    to={`/student/${student.email}`}
                                    className="hover:text-[var(--accent)]"
                                  >
                                    {student.firstName} {student.lastName}
                                  </Link>
                                  {getStudentCourses(student.email).length >
                                    0 && (
                                    <button
                                      onClick={() =>
                                        navigate("/deleted-students-list")
                                      }
                                      className="ml-2 text-[var(--accent)] hover:underline text-sm"
                                    >
                                      ({getStudentCourses(student.email).length}{" "}
                                      courses)
                                    </button>
                                  )}
                                </td>
                                <td className="p-3">{student.email}</td>
                                <td className="p-3">
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() =>
                                        handleViewStudentProgress(student)
                                      }
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                                    >
                                      {selectedStudent?.email === student.email
                                        ? "Hide"
                                        : "Progress"}
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleRemoveStudent(student.email)
                                      }
                                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                    >
                                      <FiTrash2 className="mr-1" /> Remove
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {filteredStudents.map((student) => (
                        <div key={student.email}>
                          {selectedStudent?.email === student.email && (
                            <div className="mt-4 p-4 bg-[var(--primary-bg-start)] rounded-lg border-l-4 border-[var(--accent)]">
                              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                                Progress for{" "}
                                <Link
                                  to={`/student/${student.email}`}
                                  className="hover:text-[var(--accent)]"
                                >
                                  {student.firstName} {student.lastName}
                                </Link>
                              </h4>
                              {getStudentProgressForCourse(
                                student.email,
                                selectedCourse
                              )?.length > 0 ? (
                                getStudentProgressForCourse(
                                  student.email,
                                  selectedCourse
                                ).map((progress, idx) => (
                                  <div key={idx} className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                      <Link
                                        to={`/progress/${progress.subject}`}
                                        className="text-[var(--text-primary)] hover:text-[var(--accent)]"
                                      >
                                        {progress.subject}
                                      </Link>
                                      <span className="text-[var(--text-secondary)]">
                                        {progress.percentage}%
                                      </span>
                                    </div>
                                    <ProgressBar
                                      subject={progress.subject}
                                      percentage={progress.percentage}
                                    />
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-[var(--text-secondary)]">
                                  No progress data available.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-center text-[var(--text-secondary)] py-4">
                      No students enrolled in this course.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
