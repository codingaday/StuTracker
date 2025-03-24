const StreakMotivator = ({ streak }) => {
  return (
    <div className="bg-[var(--accent)] p-6 rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-2">Streak Motivator</h3>
      <p className="text-2xl font-bold">{streak} Days Streak!</p>
      <p className="text-[var(--text-primary)] mt-2">Keep it up!</p>
    </div>
  );
};

export default StreakMotivator;
