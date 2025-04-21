import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
       
        <h1 className="dashboard-title">Lost & Found System</h1>

        <div className="auth-buttons">
          {!token ? (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/signup" className="btn">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn">Logout</button>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        <button className="action-btn" onClick={() => navigate('/found')}>
          I have found something
        </button>
        <button className="action-btn lost-btn" onClick={() => navigate('/lost')}>
          I have lost something
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
