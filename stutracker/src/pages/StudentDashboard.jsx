import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const { user, setUser } = useAuth(); // Added setUser to update profile
  const navigate = useNavigate();

  // Mock state for goals
  const [goals, setGoals] = useState(["Finish homework", "Study for test"]);

  useEffect(() => {
    if (!user || user.userType !== "student") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.userType !== "student") return null;

  // Add goal
  const addGoal = () => {
    const newGoal = prompt("Enter your new goal:");
    if (newGoal) setGoals([...goals, newGoal]);
  };

  // Edit profile (mock - updates firstName for simplicity)
  const editProfile = () => {
    const newFirstName = prompt("Enter new first name:", user.firstName);
    if (newFirstName) {
      const updatedUser = { ...user, firstName: newFirstName };
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage
      setUser(updatedUser); // Update context state
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">Student Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-4">
          Welcome, {user.firstName} {user.lastName}!
        </p>
        <p className="text-[var(--text-secondary)] mt-2">
          Grade: {user.gradeLevel}, School: {user.school}
        </p>

        {/* Goals Section */}
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold">My Goals</h2>
          <ul className="mt-2">
            {goals.map((goal, index) => (
              <li key={index} className="py-1">
                {goal}
              </li>
            ))}
          </ul>
          <button
            onClick={addGoal}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Goal
          </button>
        </div>

        {/* Profile Section */}
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="mt-2">First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
          <button
            onClick={editProfile}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
