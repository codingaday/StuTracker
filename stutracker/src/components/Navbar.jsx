import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[var(--accent)] text-[var(--text-primary)] p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        StuTracker
      </Link>
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        className={`md:flex items-center gap-6 ${
          isOpen ? "block" : "hidden"
        } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-[var(--accent)] md:bg-transparent p-4 md:p-0`}
      >
        <Link to="/about" className="block md:inline-block py-2 md:py-0">
          About
        </Link>
        <Link to="/services" className="block md:inline-block py-2 md:py-0">
          Services
        </Link>
        <Link to="/contact" className="block md:inline-block py-2 md:py-0">
          Contact
        </Link>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="block md:inline-block py-2 md:py-0"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="block md:inline-block py-2 md:py-0"
            >
              Logout
            </button>
          </>
        ) : location.pathname === "/login" ? (
          <Link to="/signup" className="block md:inline-block py-2 md:py-0">
            Signup
          </Link>
        ) : (
          <Link to="/login" className="block md:inline-block py-2 md:py-0">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
