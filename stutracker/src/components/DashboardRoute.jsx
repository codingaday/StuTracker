import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";

const DashboardRoute = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.userType === "student") {
    return <StudentDashboard />;
  } else if (user.userType === "teacher") {
    return <TeacherDashboard />;
  }
  return <Navigate to="/login" />;
};

export default DashboardRoute;
