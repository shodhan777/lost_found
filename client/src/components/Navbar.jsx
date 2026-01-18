import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, Menu, X, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Check if user is logged in
    const getUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    };
    const user = getUser();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav style={{
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Search size={24} color="#818cf8" /> FindIt
            </Link>

            {/* Desktop Menu */}
            <div className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
                <Link to="/lost" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Lost Items</Link>
                <Link to="/found" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Found Items</Link>

                {user ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/report-lost">
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Report Lost</button>
                        </Link>
                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '500', textDecoration: 'none' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                                {user.name.charAt(0)}
                            </div>
                            {user.name}
                        </Link>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }} title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ color: 'white', fontWeight: '500', textDecoration: 'none' }}>Login</Link>
                        <Link to="/signup">
                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Up</button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="mobile-toggle" style={{ display: 'none' }}>
                <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="mobile-menu-open">
                    <Link to="/" onClick={toggleMenu} style={{ color: 'white', padding: '0.5rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Home</Link>
                    <Link to="/lost" onClick={toggleMenu} style={{ color: 'white', padding: '0.5rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Lost Items</Link>
                    <Link to="/found" onClick={toggleMenu} style={{ color: 'white', padding: '0.5rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Found Items</Link>
                    {user ? (
                        <>
                            <Link to="/report-lost" onClick={toggleMenu} style={{ color: 'var(--primary)', padding: '0.5rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Report Lost Item</Link>
                            <Link to="/profile" onClick={toggleMenu} style={{ color: 'white', padding: '0.5rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>My Profile ({user.name})</Link>
                            <div onClick={() => { handleLogout(); toggleMenu(); }} style={{ color: '#ef4444', padding: '0.5rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <LogOut size={16} /> Logout
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={toggleMenu} style={{ color: 'white', padding: '0.5rem', textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" onClick={toggleMenu} style={{ color: 'var(--secondary)', padding: '0.5rem', textDecoration: 'none' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
            <style>{`
                @media (max-width: 768px) {
                    .mobile-toggle { display: block !important; }
                    .desktop-only { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
