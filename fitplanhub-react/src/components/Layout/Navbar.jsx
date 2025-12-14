import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <div className="logo-icon">💪</div>
          FitPlanHub
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Explore</Link>
          {user?.role === 'user' && (
            <>
              <Link to="/feed" className="nav-link">Feed</Link>
              <Link to="/trainers" className="nav-link">Discover Trainers</Link>
            </>
          )}
          {user?.role === 'trainer' && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/trainers" className="nav-link">Discover Trainers</Link>
            </>
          )}
        </div>

        <div className="auth-section">
          {!token ? (
            <Link to="/login">
              <Button variant="secondary" size="sm">Login</Button>
            </Link>
          ) : (
            <div className="user-menu">
              <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
              <Button size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
