import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ marginTop: 'auto', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between' }}>

                    {/* Brand */}
                    <div style={{ flex: '1 1 300px' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                                F
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>FindIt</span>
                        </Link>
                        <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', maxWidth: '400px' }}>
                            We help you stay connected with your belongings. The most trusted platform for lost and found items in your community.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'white' }}>Platform</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}>Home</Link>
                                <Link to="/lost" style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}>Lost Items</Link>
                                <Link to="/found" style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}>Found Items</Link>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'white' }}>Help & Legal</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Link to="/support" style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}>Customer Support</Link>
                                <Link to="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}>Privacy Policy</Link>
                                <Link to="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}>Terms & Conditions</Link>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'white' }}>Contact</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-dim)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Phone size={18} /> +91 7349054329
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Mail size={18} /> shishird003@gmail.com
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={18} /> FindIt HQ, Bangalore
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>&copy; 2026 FindIt Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="https://github.com/shishird-03" target="_blank" rel="noopener noreferrer">
                            <Github size={20} color="var(--text-dim)" cursor="pointer" />
                        </a>
                        <Twitter size={20} color="var(--text-dim)" cursor="pointer" />
                        <a href="https://www.linkedin.com/in/shishir-d-85219a28b/" target="_blank" rel="noopener noreferrer">
                            <Linkedin size={20} color="var(--text-dim)" cursor="pointer" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
