import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className=" flex-1 mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)] py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-6">
              Discover how StuTracker can help students and teachers achieve
              academic success with our powerful features.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center mb-8">
              What We Offer
            </h2>
            <div className="space-y-8">
              {/* Service 1: Progress Tracking */}
              <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Progress Tracking
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Students can monitor their academic progress with detailed,
                  subject-wise progress bars. Teachers can view class-wide
                  performance to identify areas for improvement, ensuring
                  everyone stays on track.
                </p>
              </div>

              {/* Service 2: Course Management */}
              <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Course Management
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Teachers can easily create, manage, and assign students to
                  courses. Students can view their enrolled courses, access
                  details like teacher information, and stay organized with
                  their academic schedule.
                </p>
              </div>

              {/* Service 3: Goal Setting */}
              <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Goal Setting
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Students can set and track personal academic goals, helping
                  them stay motivated and focused. This feature encourages
                  self-discipline and provides a clear path to success.
                </p>
              </div>

              {/* Service 4: Streak Motivator */}
              <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Streak Motivator
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Our streak motivator tracks daily engagement, encouraging
                  students to maintain consistent study habits. It’s a fun way
                  to build momentum and stay committed to learning.
                </p>
              </div>

              {/* Service 5: Quiz Challenges */}
              <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Quiz Challenges
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Students can participate in daily quiz challenges to test
                  their knowledge and reinforce learning. This feature makes
                  studying interactive and engaging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 text-center bg-[var(--primary-bg-end)]">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Start Using StuTracker Today
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Ready to take your academic journey to the next level? Sign up now
              and explore all that StuTracker has to offer!
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

export default Services;
