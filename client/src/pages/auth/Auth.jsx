import "./auth.scss";
import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Dummy-Data
import { userLevels } from "../../dummyData";

// Context
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { makeRequest } from "../../requestMethod";

function Auth() {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  // const navigate = useNavigate();

  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Login fields
    email: "",
    password: "",
    // Register fields
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    fatherPhoneNumber: "",
    confirmPassword: "",
    level: "",
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Email should be valid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6 || password.length > 50)
      return "Password min is 6, max is 50";
    return "";
  };

  const validateRequired = (value, fieldName, min = 2, max = 50) => {
    if (!value) return `${fieldName} is required`;
    if (value.length < min || value.length > max)
      return `${fieldName} min is ${min}, max is ${max}`;
    return "";
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(\+20)?(10|11|12|15)[0-9]{8}$/;
    if (!phoneNumber) return "Phone number is required";
    if (!phoneRegex.test(phoneNumber))
      return "Phone number must be a valid Egyptian number (e.g. 010XXXXXXXX or +2010XXXXXXXX)";
    return "";
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      // Login validation
      newErrors.email = validateEmail(formData.email);
      newErrors.password = validatePassword(formData.password);
    } else {
      // Register validation
      newErrors.email = validateEmail(formData.email);
      newErrors.password = validatePassword(formData.password);
      newErrors.username = validateRequired(formData.username, "Username");
      newErrors.firstName = validateRequired(formData.firstName, "First name");
      newErrors.lastName = validateRequired(formData.lastName, "Last name");
      newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
      newErrors.fatherPhoneNumber = validatePhoneNumber(
        formData.fatherPhoneNumber
      );

      if (!formData.level) {
        newErrors.level = "Level is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await makeRequest.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.status === "success" && response.data.data?.token) {
          await login(response.data.data.token);
          toast.success("Login successful!");
          // navigate("/");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } else {
        // Register
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          fatherPhoneNumber: formData.fatherPhoneNumber,
          level: formData.level,
        };

        const response = await makeRequest.post("/auth/register", registerData);

        if (response.data.status === "success") {
          toast.success("Registration successful! Please login.");
          setIsLogin(true);
          // Clear form
          setFormData({
            email: formData.email, // Keep email for login
            password: "",
            username: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            fatherPhoneNumber: "",
            confirmPassword: "",
            level: "",
          });
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      }
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      fatherPhoneNumber: "",
      confirmPassword: "",
      level: "",
    });
  };

  return (
    <div className={`auth-container ${theme}`}>
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">
                <span>🎓</span>
              </div>
              <h1>LMS Pro</h1>
            </div>

            <div className="auth-tabs">
              <button
                className={`tab ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Login
              </button>
              <button
                className={`tab ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Register
              </button>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div
              className={`form-container ${
                isLogin ? "login-mode" : "register-mode"
              }`}
            >
              {/* Login Form */}
              {isLogin ? (
                <div className="login-fields">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "error" : ""}
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                      <span className="input-icon">📧</span>
                    </div>
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "error" : ""}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                  </div>
                </div>
              ) : (
                /* Register Form */
                <div className="register-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? "error" : ""}
                          placeholder="First name"
                          autoComplete="given-name"
                        />
                        <span className="input-icon">👤</span>
                      </div>
                      {errors.firstName && (
                        <span className="error-message">
                          {errors.firstName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? "error" : ""}
                          placeholder="Last name"
                          autoComplete="family-name"
                        />
                        <span className="input-icon">👤</span>
                      </div>
                      {errors.lastName && (
                        <span className="error-message">{errors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? "error" : ""}
                        placeholder="Choose a username"
                        autoComplete="username"
                      />
                      <span className="input-icon">👤</span>
                    </div>
                    {errors.username && (
                      <span className="error-message">{errors.username}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "error" : ""}
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                      <span className="input-icon">📧</span>
                    </div>
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Your Phone</label>
                      <div className="input-wrapper">
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={errors.phoneNumber ? "error" : ""}
                          placeholder="010XXXXXXXX"
                          autoComplete="tel"
                        />
                        <span className="input-icon">📱</span>
                      </div>
                      {errors.phoneNumber && (
                        <span className="error-message">
                          {errors.phoneNumber}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="fatherPhoneNumber">Father's Phone</label>
                      <div className="input-wrapper">
                        <input
                          type="tel"
                          id="fatherPhoneNumber"
                          name="fatherPhoneNumber"
                          value={formData.fatherPhoneNumber}
                          onChange={handleChange}
                          className={errors.fatherPhoneNumber ? "error" : ""}
                          placeholder="010XXXXXXXX"
                          autoComplete="tel"
                        />
                        <span className="input-icon">📞</span>
                      </div>
                      {errors.fatherPhoneNumber && (
                        <span className="error-message">
                          {errors.fatherPhoneNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="level">Education Level</label>
                    <div className="select-wrapper">
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className={errors.level ? "error" : ""}
                      >
                        <option value="">Select your grade level</option>
                        <optgroup label="Primary School">
                          {userLevels.slice(0, 6).map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Preparatory School">
                          {userLevels.slice(6, 9).map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Secondary School">
                          {userLevels.slice(9, 12).map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <span className="select-icon">🎓</span>
                    </div>
                    {errors.level && (
                      <span className="error-message">{errors.level}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={errors.password ? "error" : ""}
                          placeholder="Create password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "🙈"}
                        </button>
                      </div>
                      {errors.password && (
                        <span className="error-message">{errors.password}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-wrapper">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={errors.confirmPassword ? "error" : ""}
                          placeholder="Confirm password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? "👁️" : "🙈"}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="error-message">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span className="checkmark"></span>I agree to the{" "}
                      <div>Terms of Service</div> and{" "}
                      <div >Privacy Policy</div>
                    </label>
                  </div> */}
                </div>
              )}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : (
                  <span>{isLogin ? "🚀 Sign In" : "✨ Create Account"}</span>
                )}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="toggle-button"
                onClick={toggleAuthMode}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
