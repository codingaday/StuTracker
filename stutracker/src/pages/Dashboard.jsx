import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-4">
          Welcome, {user.firstName} {user.lastName}!
        </p>
        <p className="text-[var(--text-secondary)] mt-2">
          {user.userType === "student"
            ? `Grade: ${user.gradeLevel}, School: ${user.school}`
            : `Role: ${user.role}, School: ${user.school}`}
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
