import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userType: "",
    gradeLevel: "",
    role: "",
    school: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
  const { signup, mockUsers } = useAuth();
  const navigate = useNavigate();

  // Regex patterns for validation
  const nameRegex = /^[A-Za-z\s]+$/; // Letters and spaces only
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };

    setPasswordCriteria(criteria);

    // Calculate strength: 20% per criterion met (5 criteria total)
    const strength = Object.values(criteria).filter(Boolean).length * 20;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate First Name
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "First name can only contain letters and spaces";
    }

    // Validate Middle Name (optional, but if provided, must follow regex)
    if (formData.middleName && !nameRegex.test(formData.middleName)) {
      newErrors.middleName = "Middle name can only contain letters and spaces";
    }

    // Validate Last Name
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    }

    // Validate User Type
    if (!formData.userType) {
      newErrors.userType = "Please select a user type";
    }

    // Validate Grade Level (for students)
    if (formData.userType === "student" && !formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required for students";
    }

    // Validate Role (for teachers)
    if (formData.userType === "teacher" && !formData.role) {
      newErrors.role = "Role is required for teachers";
    }

    // Validate School
    if (!formData.school) {
      newErrors.school = "School name is required";
    }

    // Validate Email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (mockUsers.some((user) => user.email === formData.email)) {
      newErrors.email = "This email is already registered";
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must meet all criteria (see below)";
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the field being edited
    setErrors({ ...errors, [name]: "" });

    // Update password strength and visibility if the password field is being edited
    if (name === "password") {
      if (value.length > 0) {
        setShowPasswordStrength(true);
        checkPasswordStrength(value);
      } else {
        setShowPasswordStrength(false);
        setPasswordStrength(0);
        setPasswordCriteria({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          specialChar: false,
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      signup({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        userType: formData.userType,
        gradeLevel: formData.gradeLevel,
        role: formData.role,
        school: formData.school,
        email: formData.email,
        password: formData.password,
      });
      // Navigate to dashboard upon successful signup
      navigate("/dashboard", { replace: true }); // Using replace to prevent going back to signup page
    } catch (error) {
      setErrors({
        submit: "An error occurred during signup. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 bg-gradient-to-r from-[var(--primary-bg-start)] to-[var(--primary-bg-end)]">
        <div className="w-full max-w-md bg-[var(--primary-bg-end)] p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center mb-6">
            Create an Account
          </h1>
          {errors.submit && (
            <p className="text-red-500 text-center mb-4">{errors.submit}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-[var(--text-secondary)] mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "ring-red-500"
                    : "focus:ring-[var(--accent-dark)]"
                }`}
                placeholder="Enter your first name"
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label
                htmlFor="middleName"
                className="block text-[var(--text-secondary)] mb-1"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                  errors.middleName
                    ? "ring-red-500"
                    : "focus:ring-[var(--accent-dark)]"
                }`}
                placeholder="Enter your middle name (optional)"
              />
              {errors.middleName && (
                <p className="text-red-500 text-sm mt-1">{errors.middleName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-[var(--text-secondary)] mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "ring-red-500"
                    : "focus:ring-[var(--accent-dark)]"
                }`}
                placeholder="Enter your last name"
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* User Type */}
            <div>
              <label
                htmlFor="userType"
                className="block text-[var(--text-secondary)] mb-1"
              >
                I am a <span className="text-red-500">*</span>
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                  errors.userType
                    ? "ring-red-500"
                    : "focus:ring-[var(--accent-dark)]"
                }`}
                required
              >
                <option value="">Select</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              {errors.userType && (
                <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
              )}
            </div>

            {/* Grade Level (for students) */}
            {formData.userType === "student" && (
              <div>
                <label
                  htmlFor="gradeLevel"
                  className="block text-[var(--text-secondary)] mb-1"
                >
                  Grade Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                    errors.gradeLevel
                      ? "ring-red-500"
                      : "focus:ring-[var(--accent-dark)]"
                  }`}
                  required
                >
                  <option value="">Select</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}th Grade
                    </option>
                  ))}
                </select>
                {errors.gradeLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gradeLevel}
                  </p>
                )}
              </div>
            )}

            {/* Role (for teachers) */}
            {formData.userType === "teacher" && (
              <div>
                <label
                  htmlFor="role"
                  className="block text-[var(--text-secondary)] mb-1"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                    errors.role
                      ? "ring-red-500"
                      : "focus:ring-[var(--accent-dark)]"
                  }`}
                  required
                >
                  <option value="">Select</option>
                  <option value="Math Teacher">Math Teacher</option>
                  <option value="Science Teacher">Science Teacher</option>
                  <option value="English Teacher">English Teacher</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            )}

            {/* School */}
            <div>
              <label
                htmlFor="school"
                className="block text-[var(--text-secondary)] mb-1"
              >
                School <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                  errors.school
                    ? "ring-red-500"
                    : "focus:ring-[var(--accent-dark)]"
                }`}
                placeholder="Enter your school name"
                required
              />
              {errors.school && (
                <p className="text-red-500 text-sm mt-1">{errors.school}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[var(--text-secondary)] mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "ring-red-500"
                    : "focus:ring-[var(--accent-dark)]"
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[var(--text-secondary)] mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "ring-red-500"
                      : "focus:ring-[var(--accent-dark)]"
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className="sr-only"
                    />
                    <span className="text-[var(--text-secondary)] text-sm flex items-center">
                      <span className="mr-1">
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>

                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </label>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

              {/* Password Strength Indicator (conditionally rendered) */}
              {showPasswordStrength && (
                <div className="mt-2 animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[var(--text-secondary)] text-sm">
                      Password Strength
                    </span>
                    <span className="text-[var(--text-secondary)] text-sm">
                      {passwordStrength}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 40
                          ? "bg-red-500"
                          : passwordStrength <= 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>

                  {/* Password Criteria */}
                  <ul className="mt-2 text-sm text-[var(--text-secondary)] space-y-1">
                    <li className="flex items-center">
                      <span
                        className={`mr-2 ${
                          passwordCriteria.length
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordCriteria.length ? "✔" : "✘"}
                      </span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`mr-2 ${
                          passwordCriteria.uppercase
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordCriteria.uppercase ? "✔" : "✘"}
                      </span>
                      1 uppercase letter
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`mr-2 ${
                          passwordCriteria.lowercase
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordCriteria.lowercase ? "✔" : "✘"}
                      </span>
                      1 lowercase letter
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`mr-2 ${
                          passwordCriteria.number
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordCriteria.number ? "✔" : "✘"}
                      </span>
                      1 number
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`mr-2 ${
                          passwordCriteria.specialChar
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordCriteria.specialChar ? "✔" : "✘"}
                      </span>
                      1 special character (@$!%*?&)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[var(--text-secondary)] mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-[var(--accent)] text-[var(--text-primary)] p-3 rounded-full focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "ring-red-500"
                      : "focus:ring-[var(--accent-dark)]"
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showConfirmPassword}
                      onChange={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="sr-only"
                    />
                    <span className="text-[var(--text-secondary)] text-sm flex items-center">
                      <span className="mr-1">
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                      {showConfirmPassword ? "Hide" : "Show"}
                    </span>
                  </label>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-[var(--text-primary)] py-3 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          {/* Links */}
          <p className="mt-4 text-[var(--text-secondary)] text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--accent)] hover:underline">
              Log in
            </Link>
          </p>
          <p className="mt-2 text-[var(--text-secondary)] text-center text-sm">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[var(--accent)] hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[var(--accent)] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
