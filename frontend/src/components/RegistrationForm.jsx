"use client";

import { useState } from "react";
import { authAPI, fetchCsrfToken } from "@/utils/api";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateForm,
  formatPrice,
} from "@/utils/validation";
import styles from "@/styles/auth.module.scss";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validation rules for form
   */
  const validationRules = {
    firstName: (value) => validateName(value, "First Name"),
    lastName: (value) => validateName(value, "Last Name"),
    email: (value) => validateEmail(value),
    password: (value) => validatePassword(value),
    confirmPassword: (value) => {
      if (value !== formData.password) {
        return { valid: false, error: "Passwords do not match" };
      }
      return { valid: true };
    },
    phone: (value) => validatePhone(value),
  };

  /**
   * Handle input change with real-time validation
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate field on blur
   */
  const handleBlur = (e) => {
    const { name } = e.target;

    if (validationRules[name]) {
      const validation = validationRules[name](formData[name]);
      if (!validation.valid) {
        setErrors((prev) => ({
          ...prev,
          [name]: validation.error,
        }));
      }
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate all fields
    const validation = validateForm(formData, validationRules);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Validate terms acceptance
    if (!formData.agreeToTerms) {
      setErrorMessage("You must agree to the terms and conditions");
      return;
    }

    try {
      setLoading(true);

      // Ensure CSRF token is available
      await fetchCsrfToken();

      // Register user
      const response = await authAPI.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone.trim() || null,
      });

      if (response.data.success) {
        // Store JWT token
        localStorage.setItem("jwtToken", response.data.token);

        setSuccessMessage("Registration successful! Redirecting...");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          agreeToTerms: false,
        });
        setErrors({});

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
        setErrorMessage("Please correct the validation errors");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.registrationForm}
      noValidate
    >
      <h1>Create Your Account</h1>

      {successMessage && (
        <div className={styles.successMessage} role="alert">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          ✗ {errorMessage}
        </div>
      )}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John"
            required
            maxLength={100}
            disabled={loading}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && (
            <span id="firstName-error" className={styles.error}>
              {errors.firstName}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Doe"
            required
            maxLength={100}
            disabled={loading}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && (
            <span id="lastName-error" className={styles.error}>
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="john@example.com"
          required
          maxLength={254}
          disabled={loading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.error}>
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password *</label>
        <div className={styles.passwordInput}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="At least 12 characters with uppercase, lowercase, number, and special character"
            required
            maxLength={128}
            disabled={loading}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "password-error" : "password-hint"
            }
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <p id="password-hint" className={styles.hint}>
          Must contain uppercase, lowercase, number, and special character
          (@$!%*?&)
        </p>
        {errors.password && (
          <span id="password-error" className={styles.error}>
            {errors.password}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Re-enter your password"
          required
          maxLength={128}
          disabled={loading}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
        />
        {errors.confirmPassword && (
          <span id="confirmPassword-error" className={styles.error}>
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number (Optional)</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="+1 (212) 555-1234"
          maxLength={20}
          disabled={loading}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <span id="phone-error" className={styles.error}>
            {errors.phone}
          </span>
        )}
      </div>

      <div className={styles.formGroup + " " + styles.checkboxGroup}>
        <input
          id="agreeToTerms"
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          disabled={loading}
          required
          aria-required="true"
        />
        <label htmlFor="agreeToTerms">
          I agree to the Terms of Service and Privacy Policy *
        </label>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className={styles.loginLink}>
        Already have an account? <a href="/auth/login">Sign In</a>
      </p>
    </form>
  );
}
