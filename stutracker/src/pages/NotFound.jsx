import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mt-16"></main>
      {/* 404 Section */}
      <section className="flex-1 flex items-center justify-center py-16 bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-[var(--text-primary)] mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8">
            Oops! It looks like the page you’re looking for doesn’t exist or has
            been moved.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--text-primary)] px-6 py-3 rounded-full"
          >
            Back to Homepage
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
