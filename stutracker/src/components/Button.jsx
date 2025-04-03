const Button = ({ children, onClick, className, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[var(--accent)] text-[var(--text-primary)] cursor-pointer font-semibold py-3 px-6 rounded-full ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
