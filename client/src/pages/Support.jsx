import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Support = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '4rem 0', flex: 1, maxWidth: '800px' }}>
                <h2 className="section-title">Customer Support</h2>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-dim)' }}>
                        We are here to help you. If you have any issues with reporting lost items, finding items, or managing your account, please reach out to us using the methods below.
                    </p>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <Mail size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Email Support</h3>
                                <p style={{ color: 'var(--text-dim)' }}>shishird003@gmail.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <Phone size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Phone Support</h3>
                                <p style={{ color: 'var(--text-dim)' }}>+91 7349054329</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <MessageCircle size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Live Chat</h3>
                                <p style={{ color: 'var(--text-dim)' }}>Available Mon-Fri, 9am - 5pm IST</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Support;
