import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import toast from "react-hot-toast";
import "./RegisterForm.css";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.register(email, password);
      login(response.token, response.user);
      toast.success("Registration successful!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us and start organizing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="register-input-wrapper">
              <Mail className="register-input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="register-password-toggle"
              >
                {showPassword ? (
                  <EyeOff className="register-icon" />
                ) : (
                  <Eye className="register-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="register-password-toggle"
              >
                {showConfirmPassword ? (
                  <EyeOff className="register-icon" />
                ) : (
                  <Eye className="register-icon" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="register-submit-button"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="register-switch-button"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
