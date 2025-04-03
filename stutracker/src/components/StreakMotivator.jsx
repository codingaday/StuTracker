import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const StreakMotivator = ({ streak }) => {
  const [animatedStreak, setAnimatedStreak] = useState(0);

  // Animate the streak count on change
  useEffect(() => {
    let start = animatedStreak;
    const end = streak;
    if (start === end) return;

    const duration = 1000; // Animation duration in ms
    const stepTime = 50; // Time per frame
    const steps = Math.abs(end - start);
    const stepValue = (end - start) / (duration / stepTime);

    const timer = setInterval(() => {
      start += stepValue;
      if ((stepValue > 0 && start >= end) || (stepValue < 0 && start <= end)) {
        setAnimatedStreak(end);
        clearInterval(timer);
      } else {
        setAnimatedStreak(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [streak]);

  // Dynamic motivational messages based on streak length
  const getMotivationalMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak <= 3) return "Great start! Keep the momentum going!";
    if (streak <= 7) return "You're on a roll! Consistency is key!";
    if (streak <= 14) return "Impressive! You're building a solid habit!";
    if (streak <= 30) return "Amazing work! You're a streak master!";
    return "Legendary! Your dedication is unmatched!";
  };

  // Calculate progress ring percentage (capped at 100% for a 30-day streak)
  const progressPercentage = Math.min((streak / 30) * 100, 100);

  return (
    <div className="bg-[var(--primary-bg-end)] p-6 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105">
      <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
        Streak Motivator
      </h3>

      {/* Progress Ring */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="10"
            opacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent-dark)"
            strokeWidth="10"
            strokeDasharray={`${progressPercentage * 2.83}, 283`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Streak count inside the ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-4xl font-bold text-[var(--text-primary)] animate-pulse">
            {animatedStreak}
          </p>
        </div>
      </div>

      {/* Streak text */}
      <p className="text-lg font-medium text-[var(--text-secondary)] mb-2">
        {animatedStreak} {animatedStreak === 1 ? "Day" : "Days"} Streak!
      </p>

      {/* Motivational message */}
      <p className="text-[var(--text-primary)] text-base italic bg-[var(--accent)] py-2 px-4 rounded-full inline-block">
        "{getMotivationalMessage()}"
      </p>
    </div>
  );
};

// PropTypes for type checking
StreakMotivator.propTypes = {
  streak: PropTypes.number.isRequired,
};

export default StreakMotivator;
