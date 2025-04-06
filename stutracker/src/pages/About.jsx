import { motion, useScroll, useTransform } from "framer-motion";
import { Parallax } from "react-parallax";
import { useState } from "react";
import { FaReact, FaJs, FaCss3Alt, FaGithub } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const About = () => {
  const { scrollY } = useScroll();
  const parallaxOffset = useTransform(scrollY, [0, 300], [0, -100]);
  const [hoveredTech, setHoveredTech] = useState(null);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.6 } },
    hover: { rotateY: 180, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-bg-start)] overflow-x-hidden">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Hero Section with Parallax */}
        <Parallax
          bgImage="/images/education-bg.jpg" // Replace with a cool education-themed image
          strength={300}
          className="relative"
        >
          <motion.section
            className="py-20 md:py-32 text-center bg-gradient-to-r from-[var(--primary-bg-start)]/80 to-[var(--primary-bg-end)]/80"
            style={{ y: parallaxOffset }}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <div className="max-w-5xl mx-auto px-4">
              <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-4 drop-shadow-lg">
                About{" "}
                <span className="text-[var(--accent)] animate-pulse">
                  StuTracker
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto font-light">
                Revolutionizing education with next-gen tools for progress
                tracking and classroom mastery.
              </p>
            </div>
          </motion.section>
        </Parallax>

        {/* Mission Section with Glow Effect */}
        <motion.section
          className="py-16 bg-[var(--primary-bg-end)] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/10 opacity-50"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 glow-text">
              Our Vision
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              We’re on a mission to redefine education—bridging the gap between
              students and teachers with a platform that’s as innovative as it
              is intuitive. StuTracker is where learning meets the future.
            </p>
          </div>
        </motion.section>

        {/* Project Section with Tech Carousel */}
        <motion.section
          className="py-16 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] text-center mb-10">
              The StuTracker Project
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
                  What We Do
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  StuTracker is a dynamic platform that empowers educators to
                  orchestrate courses and monitor progress while giving students
                  a clear path to academic excellence.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
                  Built With Passion
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  Powered by modern tech, StuTracker blends speed, style, and
                  scalability—ready to evolve with a full backend in the future.
                </p>
                {/* Tech Stack Carousel */}
                <div className="flex justify-center gap-6 flex-wrap animate-tech-scroll">
                  {[
                    { name: "React", icon: <FaReact size={40} /> },
                    { name: "JavaScript", icon: <FaJs size={40} /> },
                    { name: "Tailwind", icon: <FaCss3Alt size={40} /> },
                    { name: "GitHub", icon: <FaGithub size={40} /> },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      className={`p-4 rounded-lg bg-[var(--primary-bg-end)] shadow-lg cursor-pointer ${
                        hoveredTech === index
                          ? "bg-[var(--accent)] text-white"
                          : "text-[var(--text-primary)]"
                      }`}
                      onMouseEnter={() => setHoveredTech(index)}
                      onMouseLeave={() => setHoveredTech(null)}
                      whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    >
                      {tech.icon}
                      <p className="mt-2 text-sm font-medium">{tech.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section with 3D Flip Cards */}
        <motion.section
          className="py-16 bg-[var(--primary-bg-end)] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-10 glow-text">
              Our Innovators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <motion.div
                className="relative h-64 perspective-1000"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                {/* Front Side */}
                <div className="absolute inset-0 bg-[var(--primary-bg-start)] p-6 rounded-lg shadow-xl backface-hidden flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img
                      src="/images/abebe.jpg" // Replace with your image
                      alt="Abebe Duguma"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.outerHTML =
                          '<span className="text-2xl text-[var(--text-secondary)]">👤</span>')
                      }
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    Abebe Duguma
                  </h3>
                  <p className="text-md text-[var(--text-secondary)]">
                    Front-End Visionary
                  </p>
                </div>
                {/* Back Side */}
                <div className="absolute inset-0 bg-[var(--accent)] p-6 rounded-lg shadow-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center text-white">
                  <p className="text-md leading-relaxed">
                    Crafting tools to elevate education through code and
                    creativity.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="relative h-64 perspective-1000"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                {/* Front Side */}
                <div className="absolute inset-0 bg-[var(--primary-bg-start)] p-6 rounded-lg shadow-xl backface-hidden flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                    <span className="text-2xl text-[var(--text-secondary)]">
                      ?
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    Join the Future
                  </h3>
                  <p className="text-md text-[var(--text-secondary)]">
                    Innovator Wanted
                  </p>
                </div>
                {/* Back Side */}
                <div className="absolute inset-0 bg-[var(--accent)] p-6 rounded-lg shadow-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center text-white">
                  <p className="text-md leading-relaxed">
                    Ready to shape education’s future? Let’s talk!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section with Glow and Animation */}
        <motion.section
          className="py-20 text-center bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="absolute inset-0 bg-[var(--accent)]/10 animate-pulse-slow"></div>
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 glow-text">
              Step Into the Future
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Join a movement that’s redefining education. Sign up now and
              unlock the power of StuTracker.
            </p>
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-10 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 glow-button"
            >
              Get Started
            </Button>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
