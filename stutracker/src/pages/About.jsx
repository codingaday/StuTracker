import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            About StuTracker
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-6">
            Empowering students and teachers to achieve academic success through
            seamless progress tracking and course management.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-[var(--primary-bg-end)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            At StuTracker, we believe in the power of education to transform
            lives. Our mission is to provide a user-friendly platform that helps
            students stay on top of their academic goals and enables teachers to
            manage their courses effectively. We aim to foster a collaborative
            environment where learning is engaging, organized, and rewarding for
            everyone involved.
          </p>
        </div>
      </section>

      {/* About the Project Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center mb-6">
            About the Project
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
            StuTracker is a web application built to streamline academic
            progress tracking and course management. It features role-based
            dashboards for students and teachers, allowing students to monitor
            their progress, set goals, and view enrolled courses, while teachers
            can create courses, add students, and track class performance.
          </p>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            The project was developed using modern web technologies like React,
            Vite, and Tailwind CSS, ensuring a fast, responsive, and visually
            appealing experience. While currently using mock data with
            `localStorage`, StuTracker is designed to scale with a real backend
            in the future.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-[var(--primary-bg-end)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
            Meet the Developer
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
              <span className="text-2xl text-[var(--text-secondary)]">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Abebe Duguma
            </h3>
            <p className="text-lg text-[var(--text-secondary)] mb-2">
              Front-End Developer
            </p>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
              I’m a passionate developer with a love for building tools that
              make a difference. I created StuTracker to help students and
              teachers stay organized and motivated in their academic journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
            Get Started with StuTracker
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            Ready to take control of your academic progress? Sign up today and
            start tracking your success!
          </p>
          <Button
            onClick={() => (window.location.href = "/signup")}
            className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--text-primary)] px-6 py-3 rounded-full"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
