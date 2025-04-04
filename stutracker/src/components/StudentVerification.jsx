import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function StudentVerification({ email, onVerified }) {
  const { isStudentRegistered } = useAuth();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (email) {
      setIsVerified(isStudentRegistered(email));
    }
  }, [email]);

  return (
    <div className="verification-badge">
      {isVerified ? (
        <span className="verified">✓ Registered Student</span>
      ) : (
        <span className="unverified">
          ✗ Not registered{" "}
          <button onClick={() => onVerified(email)}>Retry</button>
        </span>
      )}
    </div>
  );
}

export default StudentVerification;
