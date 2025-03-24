import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center text-center md:text-left px-4 py-8">
        <div className="mb-6 md:mb-0 md:mr-8">
          <img
            src="/images/home.png"
            alt="Classroom"
            className="rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0"
          />
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to StuTracker
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            The leading platform for student progress, parent communication, and
            classroom management.
          </p>
          <Link to="/signup">
            <Button>Let's Begin</Button>
          </Link>
          <p className="mt-4 text-[var(--text-secondary)]">
            Have an account?{" "}
            <Link to="/login" className="underline">
              Log in!
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;
