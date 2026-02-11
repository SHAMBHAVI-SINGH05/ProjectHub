// src/components/SignIn.tsx
import { useState } from 'react';
import './SignIn.css';

interface SignInProps {
  onSignIn: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(formData.email, formData.password);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your projectHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="signin-btn primary">
            🔐 Sign In
          </button>
        </form>

        <div className="switch-auth">
          <p>Don't have an account? <button onClick={onSwitchToRegister} className="link-btn">Sign Up</button></p>
        </div>

        <div className="social-signin">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button type="button" className="social-btn google">
              <span>Google</span>
            </button>
            <button type="button" className="social-btn github">
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;