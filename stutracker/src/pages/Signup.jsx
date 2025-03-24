import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userType: "",
    gradeLevel: "",
    role: "",
    school: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    signup({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      userType: formData.userType,
      gradeLevel: formData.gradeLevel,
      role: formData.role,
      school: formData.school,
      email: formData.email,
      password: formData.password,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Create An Account
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              Middle Name:
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
            />
          </div>
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              Student/Teacher:
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            >
              <option value="">Select</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          {formData.userType === "student" && (
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">
                Grade Level (Student only):
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                required
              >
                <option className="text-3xl font-bold" value="">
                  Select
                </option>
                <option value="1">1st Grade</option>
                <option value="2">2nd Grade</option>
                <option value="3">3rd Grade</option>
                <option value="4">4th Grade</option>
                <option value="5">5th Grade</option>
                <option value="6">6th Grade</option>
                <option value="7">7th Grade</option>
                <option value="8">8th Grade</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
            </div>
          )}
          {formData.userType === "teacher" && (
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">
                Role (Teacher only):
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
                required
              >
                <option className="text-3xl font-bold" value="">
                  Select
                </option>
                <option value="math">Math Teacher</option>
                <option value="science">Science Teacher</option>
                <option value="english">English Teacher</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              School:
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            SIGNUP
          </Button>
        </form>
        <p className="mt-4 text-[var(--text-secondary)] text-center">
          Have an account?{" "}
          <Link to="/login" className="underline">
            Log in!
          </Link>
        </p>
        <p className="mt-2 text-[var(--text-secondary)] text-center text-sm">
          By continuing, you agree to the Terms of Use. Read our{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
