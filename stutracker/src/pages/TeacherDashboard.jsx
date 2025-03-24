import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import StreakMotivator from "../components/StreakMotivator";
import QuizModal from "../components/QuizModal";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(5); // Simulated streak
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Simulated class progress data
  const classProgressData = [
    { subject: "Class Average - Math", percentage: 82 },
    { subject: "Class Average - Science", percentage: 78 },
    { subject: "Class Average - English", percentage: 85 },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img
              src="/images/dashboard-teacher-teaching.png"
              alt="Academic Work"
              className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {user.userType === "student"
              ? `${user.gradeLevel}th Grade Student, ${user.school}`
              : `${user.role}, ${user.school}`}
          </p>
        </div>

        {/* Class Progress Section */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Class Progress
          </h2>
          <div className="max-w-2xl mx-auto">
            {classProgressData.map((data, index) => (
              <ProgressBar
                key={index}
                subject={data.subject}
                percentage={data.percentage}
              />
            ))}
          </div>
        </section>

        {/* Streak and Quiz Sections */}
        <section className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Streak Motivator */}
          <div className="flex-1">
            <StreakMotivator streak={streak} />
          </div>

          {/* Quiz Challenge */}
          <div className="flex-1 bg-[var(--primary-bg-end)] p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Daily Quiz Challenge</h3>
            <Button onClick={() => setIsQuizOpen(true)}>Take a Quiz</Button>
          </div>
        </section>
      </main>
      <Footer />

      {/* Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default TeacherDashboard;
