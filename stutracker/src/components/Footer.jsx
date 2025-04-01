import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <div className="mt-16">
      <footer className="fixed bottom-0 left-0 right-0 bg-[var(--accent)] text-[var(--text-primary)] p-4 flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-y-0">
        <Link to="/" className="text-xl font-bold">
          StuTracker
        </Link>
        <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:gap-x-6">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/services" className="hover:underline">
            Services
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          {user ? (
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="hover:underline">
              Log in
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
