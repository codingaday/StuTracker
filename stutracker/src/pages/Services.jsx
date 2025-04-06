import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-bg-start)]">
      <Navbar />
      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-4 glow-text">
              Our <span className="text-[var(--accent)]">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto font-light">
              Discover how StuTracker helps students and teachers achieve more
              through innovation and simplicity.
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-12 glow-text">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Progress Tracking",
                  description:
                    "Track academic progress visually with subject-specific bars and teacher overviews to boost classroom performance.",
                },
                {
                  title: "Course Management",
                  description:
                    "Seamlessly create, organize, and assign courses. Students stay informed and structured with course access and updates.",
                },
                {
                  title: "Goal Setting",
                  description:
                    "Empower students to set, monitor, and accomplish personal academic milestones while building discipline.",
                },
                {
                  title: "Streak Motivator",
                  description:
                    "Keep motivation high with daily engagement streaks. Foster consistency in learning through gamified habit tracking.",
                },
                {
                  title: "Quiz Challenges",
                  description:
                    "Daily quizzes based on course content and API integrations help reinforce learning through interactive tests.",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-[var(--primary-bg-end)] p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 glow-text">
              Experience the Future of Learning
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Join the growing StuTracker community and transform your academic
              journey.
            </p>
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="bg-[var(--accent)] hover:bg-cyan-500 text-white px-10 py-4 rounded-full shadow-lg glow-button transform transition-all duration-300 hover:scale-110"
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
