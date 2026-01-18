import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '4rem 0', flex: 1, maxWidth: '1000px' }}>
                <h2 className="section-title">Contact Us</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Contact Info */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Get in Touch</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                                    <Phone size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Phone</h4>
                                    <p style={{ color: 'var(--text-dim)' }}>+91 7349054329</p>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Mon-Fri 9am-6pm</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                                    <Mail size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email</h4>
                                    <p style={{ color: 'var(--text-dim)' }}>shishird003@gmail.com</p>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Online support 24/7</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                                    <MapPin size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Location</h4>
                                    <p style={{ color: 'var(--text-dim)' }}>FindIt HQ, Tech Park</p>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Bangalore, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Send Message</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Message</label>
                                <textarea
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
};

export default Contact;
