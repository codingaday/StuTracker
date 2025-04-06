import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FiBookOpen, FiDownload, FiFilter, FiBarChart2 } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentCoursesDetail = () => {
  const { studentEmail } = useParams();
  const { user, getStudentCourses, getStudentProgressForCourse, mockUsers } =
    useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      navigate("/login");
      return;
    }
    const coursesData = getStudentCourses(studentEmail);
    setCourses(coursesData);
    setLoading(false);
  }, [user, navigate, getStudentCourses, studentEmail]);

  const student = mockUsers.find((u) => u.email === studentEmail) || {};

  const handleSort = () => {
    const sortedCourses = [...courses].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    setCourses(sortedCourses);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredCourses = courses.filter((course) => {
    if (filterStatus === "all") return true;
    return filterStatus === "completed" ? course.done : !course.done;
  });

  const handleExport = () => {
    setIsExporting(true);
    const csvContent = [
      "Course Name,Type,Progress,Status",
      ...filteredCourses.map((course) => {
        const progressData = getStudentProgressForCourse(
          studentEmail,
          course.id
        );
        const progress =
          progressData.length > 0 ? progressData[0].percentage : 0;
        return `${course.name},${course.type},${progress},${
          course.done ? "Completed" : "In Progress"
        }`;
      }),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${studentEmail}_courses.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const toggleChart = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const getChartData = (course) => {
    const progressData = getStudentProgressForCourse(studentEmail, course.id);
    const progress = progressData.length > 0 ? progressData[0].percentage : 0;
    return {
      labels: ["Progress"],
      datasets: [
        {
          label: `${course.name} Progress`,
          data: [progress],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Percentage (%)" },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Course Progress" },
    },
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
      <Navbar />
      <main className="flex-1 px-4 py-8 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Courses for {student.firstName} {student.lastName} ({studentEmail}
              )
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-all duration-200 disabled:opacity-50"
              >
                <FiDownload className="mr-2" /> Export
              </button>
            </div>
          </div>

          {/* Student Summary */}
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Student Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg shadow-inner">
                <p className="text-[var(--text-secondary)] text-sm">
                  Total Courses
                </p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {courses.length}
                </p>
              </div>
              <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg shadow-inner">
                <p className="text-[var(--text-secondary)] text-sm">
                  Completed
                </p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {courses.filter((c) => c.done).length}
                </p>
              </div>
              <div className="bg-[var(--primary-bg-start)] p-4 rounded-lg shadow-inner">
                <p className="text-[var(--text-secondary)] text-sm">
                  Average Progress
                </p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {courses.length > 0
                    ? Math.round(
                        courses.reduce((acc, course) => {
                          const progressData = getStudentProgressForCourse(
                            studentEmail,
                            course.id
                          );
                          return (
                            acc +
                            (progressData.length > 0
                              ? progressData[0].percentage
                              : 0)
                          );
                        }, 0) / courses.length
                      ) + "%"
                    : "0%"}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <FiFilter className="text-[var(--text-secondary)]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 border border-[var(--accent)] rounded-lg bg-[var(--primary-bg-start)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="all">All Courses</option>
                <option value="completed">Completed</option>
                <option value="inProgress">In Progress</option>
              </select>
            </div>
            <button
              onClick={handleSort}
              className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-all duration-200"
            >
              Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>
          </div>

          {/* Courses List */}
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
            {filteredCourses.length > 0 ? (
              <div className="space-y-4">
                {filteredCourses.map((course) => {
                  const progressData = getStudentProgressForCourse(
                    studentEmail,
                    course.id
                  );
                  const progress =
                    progressData.length > 0 ? progressData[0].percentage : 0;
                  return (
                    <div
                      key={course.id}
                      className="bg-[var(--primary-bg-start)] p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            {course.name} ({course.type})
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[var(--accent)] h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-[var(--text-secondary)]">
                              {progress}%
                            </span>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                course.done
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {course.done ? "Completed" : "In Progress"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleChart(course.id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded flex items-center"
                          >
                            <FiBarChart2 className="mr-1" />
                            {expandedCourseId === course.id
                              ? "Hide Chart"
                              : "Show Chart"}
                          </button>
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="bg-[var(--accent)] hover:bg-cyan-500 text-white text-sm px-3 py-1 rounded flex items-center"
                          >
                            <FiBookOpen className="mr-1" /> View
                          </button>
                        </div>
                      </div>
                      {expandedCourseId === course.id && (
                        <div className="mt-4 h-64">
                          <Bar
                            data={getChartData(course)}
                            options={chartOptions}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[var(--text-secondary)] py-4">
                No courses match the current filter.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentCoursesDetail;
