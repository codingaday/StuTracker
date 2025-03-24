import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-[var(--accent)] text-[var(--text-primary)] p-4 flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-y-0">
      <Link to="/" className="text-xl font-bold">
        StuTracker
      </Link>
      <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:gap-x-6">
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
