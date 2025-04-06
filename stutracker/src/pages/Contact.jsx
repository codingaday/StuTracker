import { useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const { scrollY } = useScroll();
  const parallaxOffset = useTransform(scrollY, [0, 300], [0, -50]);

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

  // Particle initialization
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 1000 } },
      color: { value: ["#4bc0c0", "#ff6384", "#36a2eb"] },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 2, random: true },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
      links: {
        enable: true,
        distance: 200,
        color: "#ffffff",
        opacity: 0.2,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormStatus("Message sent! We’ll respond soon.");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormStatus(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-bg-start)] relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
        />
      </div>

      <Navbar />

      <main className="flex-1 mt-16 z-10">
        {/* Hero Section */}
        <motion.section
          className="py-20 md:py-32 text-center bg-gradient-to-r from-[var(--primary-bg-start)]/80 to-[var(--primary-bg-end)]/80 relative"
          style={{ y: parallaxOffset }}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-4 glow-text">
              Contact{" "}
              <span className="text-[var(--accent)] animate-pulse">
                StuTracker
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto font-light">
              Got questions or ideas? Let’s connect and shape the future of
              education.
            </p>
          </div>
        </motion.section>

        {/* Contact Info and Form Section */}
        <motion.section
          className="py-16 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-8">
              {[
                {
                  icon: <FaEnvelope size={32} />,
                  title: "Email Us",
                  detail: "support@stutracker.com",
                  link: "mailto:support@stutracker.com",
                },
                {
                  icon: <FaPhone size={32} />,
                  title: "Call Us",
                  detail: "+251 (234) 567-890",
                  link: "tel:+251234567890",
                },
                {
                  icon: <FaMapMarkerAlt size={32} />,
                  title: "Find Us",
                  detail: "1000 Addis Ababa, Learning City",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="relative h-40 perspective-1000"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-xl backface-hidden flex items-center gap-4">
                    <div className="text-[var(--accent)]">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                        >
                          {item.detail}
                        </a>
                      ) : (
                        <p className="text-[var(--text-secondary)]">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Back Side */}
                  <div className="absolute inset-0 bg-[var(--accent)] p-6 rounded-lg shadow-xl backface-hidden rotate-y-180 flex items-center justify-center text-white">
                    <p className="text-md font-medium">
                      {item.title === "Find Us"
                        ? "Drop by anytime!"
                        : `Reach out via ${item.title.toLowerCase()}!`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-[var(--primary-bg-end)] p-8 rounded-xl shadow-lg relative">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 glow-text">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-[var(--text-secondary)] mb-2"
                  >
                    Name
                  </label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-4 rounded-full border border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] glow-input"
                    placeholder="Your Name"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-[var(--text-secondary)] mb-2"
                  >
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-4 rounded-full border border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] glow-input"
                    placeholder="Your Email"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-[var(--text-secondary)] mb-2"
                  >
                    Message
                  </label>
                  <motion.textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[var(--primary-bg-start)] text-[var(--text-primary)] p-4 rounded-lg border border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] glow-input"
                    rows="5"
                    placeholder="Your Message"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                {formStatus && (
                  <motion.p
                    className="text-green-400 text-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {formStatus}
                  </motion.p>
                )}
                <div className="text-center">
                  <Button
                    type="submit"
                    className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-8 py-3 rounded-full shadow-lg glow-button flex items-center justify-center gap-2 mx-auto"
                  >
                    <FaPaperPlane /> Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
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
              Ready to Join Us?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Sign up now and start revolutionizing education with StuTracker.
            </p>
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-10 py-4 rounded-full shadow-lg glow-button transform transition-all duration-300 hover:scale-110"
            >
              Sign Up Now
            </Button>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
