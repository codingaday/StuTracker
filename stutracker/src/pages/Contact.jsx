import { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission logic
    console.log("Form submitted:", formData);
    setFormStatus("Thank you for your message! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormStatus(null), 5000); // Clear message after 5 seconds
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-6">
              We'd love to hear from you! Reach out with any questions,
              feedback, or inquiries.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-12 bg-[var(--primary-bg-end)]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-4 flex flex-col mx-auto text-center width-full max-w-md">
              <p className="text-lg text-[var(--text-secondary)] text-left pl-11.5">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@stutracker.com"
                  className="text-[var(--accent)] hover:underline"
                >
                  support@stutracker.com
                </a>
              </p>
              <p className="text-lg text-[var(--text-secondary)] text-left pl-11.5">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+1234567890"
                  className="text-[var(--accent)] hover:underline"
                >
                  +251 (234) 567-890
                </a>
              </p>
              <p className="text-lg text-[var(--text-secondary)] text-left pl-11.5">
                <strong>Address:</strong> 1000 Addis Ababa, Learning City
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center mb-6">
              Get in Touch
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg"
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-[var(--text-secondary)] mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-[var(--text-secondary)] mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-[var(--text-secondary)] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                  rows="5"
                  placeholder="Your Message"
                  required
                />
              </div>
              {formStatus && (
                <p className="text-green-500 text-center mb-4">{formStatus}</p>
              )}
              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--text-primary)] px-6 py-3 rounded-full"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 text-center bg-[var(--primary-bg-end)]">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Sign up today and start tracking your academic progress with
              StuTracker!
            </p>
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--text-primary)] px-6 py-3 rounded-full"
            >
              Sign Up Now
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
