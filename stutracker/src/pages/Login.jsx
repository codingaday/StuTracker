import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(formData.email, formData.password);
    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Time to Reconnect!
        </h1>
        <div className="mb-6">
          <img
            src="/images/login.png"
            alt="Classroom"
            className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto"
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
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
          Don’t have an account?{" "}
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
