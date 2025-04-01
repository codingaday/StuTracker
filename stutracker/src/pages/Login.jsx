import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(formData.email, formData.password);
    if (success) {
      navigate("/dashboard", { replace: true }); // Added replace: true to prevent going back to login page
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left px-4 py-8">
          <img
            src="/images/login.png"
            alt="Classroom"
            className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto md:mr-4 mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:ml-4 mt-4">
            Time to Reconnect!
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[var(--text-secondary)] mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[var(--text-secondary)] mb-1"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="sr-only"
                  />
                  <span className="text-[var(--text-secondary)] text-sm flex items-center">
                    <span className="mr-1">
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </label>
              </div>
            </div>
            <p className="text-right text-[var(--text-secondary)] mt-1">
              <a href="#" className="underline">
                Forgot password?
              </a>
            </p>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4 text-[var(--text-secondary)] text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="underline">
            SIGNUP!
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
