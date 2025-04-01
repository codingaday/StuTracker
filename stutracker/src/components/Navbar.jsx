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
    <nav className="fixed top-0 left-0 w-full bg-[var(--accent)] text-[var(--text-primary)] p-4 flex justify-between items-center z-50 shadow-md">
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      <div
        className={`md:flex items-center gap-6 ${
          isOpen ? "block" : "hidden"
        } md:block absolute md:static top-14 left-0 w-full md:w-auto bg-[var(--accent)] md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
      >
        <Link
          to="/about"
          className="block md:inline-block py-2 md:py-0 hover:underline"
        >
          About
        </Link>
        <Link
          to="/services"
          className="block md:inline-block py-2 md:py-0 hover:underline"
        >
          Services
        </Link>
        <Link
          to="/contact"
          className="block md:inline-block py-2 md:py-0 hover:underline"
        >
          Contact
        </Link>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="block md:inline-block py-2 md:py-0 hover:underline"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="block md:inline-block py-2 md:py-0 hover:underline"
            >
              Logout
            </button>
          </>
        ) : location.pathname === "/login" ? (
          <Link
            to="/signup"
            className="block md:inline-block py-2 md:py-0 hover:underline"
          >
            Signup
          </Link>
        ) : (
          <Link
            to="/login"
            className="block md:inline-block py-2 md:py-0 hover:underline"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
