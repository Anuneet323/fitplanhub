import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import authService from '../services/authService';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/Common/Button';
import Message from '../components/Common/Message';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error, request, clearError } = useApi();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await request(() => 
      authService.login({ email: formData.email, password: formData.password })
    );

    if (result.success) {
      login(result.data.user, result.data.token);
      setMessage({ type: 'success', text: 'Login successful!' });
      setTimeout(() => {
        navigate(result.data.user.role === 'trainer' ? '/dashboard' : '/feed');
      }, 1000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Login failed' });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await request(() => 
      authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
    );

    if (result.success) {
      login(result.data.user, result.data.token);
      setMessage({ type: 'success', text: 'Signup successful!' });
      setTimeout(() => {
        navigate(result.data.user.role === 'trainer' ? '/dashboard' : '/feed');
      }, 1000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Signup failed' });
    }
  };

  return (
    <MainLayout>
      <div className="form-container">
        {message && (
          <Message 
            type={message.type} 
            text={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        <h2 className="form-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="form-subtitle">
          {isLogin ? 'Sign in to your FitPlanHub account' : 'Join FitPlanHub as a user or trainer'}
        </p>

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">I am a:</label>
              <div className="role-selector">
                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                  />
                  <label style={{cursor: 'pointer'}}>👤 User</label>
                </div>
                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="trainer"
                    checked={formData.role === 'trainer'}
                    onChange={handleChange}
                  />
                  <label style={{cursor: 'pointer'}}>🏋️ Trainer</label>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <a onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer'}}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
