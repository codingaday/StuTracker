import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import useParticles, { Particles } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Welcome = () => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const taglines = [
    "Track student progress effortlessly.",
    "Empower teachers, engage parents.",
    "Your classroom, revolutionized.",
    "Education meets innovation.",
  ];

  // Particle initialization
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: ["#4bc0c0", "#ff6384", "#36a2eb"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  };

  const { particlesLoaded } = useParticles(particlesInit, particlesOptions);

  // Rotate taglines every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] overflow-hidden relative">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesOptions}
        />
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16 z-10">
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-8 max-w-6xl mx-auto">
          {/* Tilt Image */}
          <Tilt
            options={{ max: 25, scale: 1.05, speed: 400 }}
            className="mb-6 md:mb-0"
          >
            <motion.img
              src="/images/home.png"
              alt="Classroom"
              className="rounded-full w-40 h-40 md:w-56 md:h-56 shadow-lg border-4 border-[var(--accent)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </Tilt>

          {/* Text and CTA */}
          <div className="max-w-lg">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to{" "}
              <span className="text-[var(--accent)]">StuTracker</span>
            </motion.h1>

            {/* Animated Tagline Rotator */}
            <motion.p
              key={taglineIndex}
              className="text-lg md:text-xl text-[var(--text-secondary)] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {taglines[taglineIndex]}
            </motion.p>

            {/* Interactive CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/signup">
                <Button
                  className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let's Begin
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  className="bg-transparent border-2 border-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log In
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <motion.p
              className="mt-4 text-[var(--text-secondary)] text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join thousands of educators and parents revolutionizing education.
            </motion.p>
          </div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Progress Tracking
            </h3>
            <p className="text-[var(--text-secondary)]">
              Monitor student performance in real-time with intuitive charts.
            </p>
          </div>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Parent Portal
            </h3>
            <p className="text-[var(--text-secondary)]">
              Keep parents informed with seamless communication tools.
            </p>
          </div>
          <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Classroom Management
            </h3>
            <p className="text-[var(--text-secondary)]">
              Organize courses and students with ease.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Floating Social Proof */}
      <motion.div
        className="fixed bottom-10 left-10 bg-[var(--accent)] text-white p-4 rounded-full shadow-lg"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-sm">Trusted by 10,000+ educators worldwide</p>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Welcome;
