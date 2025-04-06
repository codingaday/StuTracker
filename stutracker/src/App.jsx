import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRoute from "./components/DashboardRoute";
import CoursePage from "./pages/CoursePage";

import StudentsList from "./components/StudentsList";
import CoursesList from "./components/CoursesList";
import DeletedStudents from "./components/DeletedStudents";
import DeletedCourses from "./components/DeletedCourses";
import StudentCourses from "./components/StudentCourses";
import StudentCoursesList from "./components/StudentCoursesList";
import StudentCoursesDetail from "./components/StudentCoursesDetail";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />

          <Route path="/students-list" element={<StudentsList />} />
          {/* <Route path="/courses-list" element={<CoursesList />} /> */}
          <Route path="/deleted-students-list" element={<DeletedStudents />} />
          <Route path="/deleted-courses-list" element={<DeletedCourses />} />

          <Route
            path="/student/:id/courses"
            element={
              <ProtectedRoute>
                <StudentCoursesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/student/:studentEmail/courses"
            element={
              <ProtectedRoute>
                <StudentCoursesDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/teacher/courses" element={<CoursesList />} />
          {/* Protected Routes for Teachers */}
          <Route path="/course/:courseId" element={<CoursePage />} />
          {/* Placeholder Routes for Navigation Links */}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
