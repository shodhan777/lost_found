import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import './Dashboard.css';
import MapComponent from './MapComponent'; // Import Map

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [recentItems, setRecentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await API.get('/items/recent');
        setRecentItems(res.data);
      } catch (err) {
        console.error("Error fetching recent items", err);
      }
    };

    fetchRecentItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const filteredItems = recentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">FindIt.</div>
        <div className="nav-links">
          {!token ? (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/signup" className="nav-btn">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="welcome-text">Welcome back!</span>
              <button onClick={handleLogout} className="nav-btn logout">Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Lost something? <br /> Let's help you find it.</h1>
          <p>The easiest way to report and reclaim lost items on campus.</p>

          <div className="cta-buttons">
            <button className="cta-btn lost" onClick={() => navigate('/lost')}>I Lost Something</button>
            <button className="cta-btn found" onClick={() => navigate('/found')}>I Found Something</button>
            <button className="cta-btn matches" onClick={() => navigate('/matches')}>View Matches</button>
          </div>
        </div>
      </header>

      {/* Recent Items Feed */}
      <section className="feed-section">
        <h2>Recent Activity</h2>

        {/* Map View Toggle or Section */}
        <div style={{ marginBottom: '3rem' }}>
          <MapComponent items={recentItems} />
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#fff', fontSize: '0.9rem', opacity: 0.8 }}>
            * Locations are approximate for demonstration.
          </p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="items-grid">
          {filteredItems.length === 0 ? (
            <p className="no-items">No recent items reported.</p>
          ) : (
            filteredItems.map(item => (
              <div key={`${item.type}-${item.id}`} className={`item-card ${item.type}`}>
                <div className="card-badge">{item.type.toUpperCase()}</div>
                {item.image_url && <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="card-img" />}
                <div className="card-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="location">📍 {item.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Lost & Found System. Built for Community.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
