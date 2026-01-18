import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Shield, Clock, Smile } from 'lucide-react';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1) 0%, rgba(15, 23, 42, 0) 50%)' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={{ padding: '6rem 0', textAlign: 'center' }} className="container fade-in">
                <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Lost Something?<br /> Let's Find It Together.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    The smartest community-driven platform to report lost items and reunite with updated found belongings instantly.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <Link to="/lost">
                        <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', width: '100%', minWidth: '200px' }}>
                            <Search size={20} /> Browse Lost Items
                        </button>
                    </Link>
                    <Link to="/found">
                        <button className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', width: '100%', minWidth: '200px' }}>
                            I Found Something
                        </button>
                    </Link>
                </div>
            </section>

            {/* Feature Cards - Floating */}
            <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Shield size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Secure & Trusted</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Verified users and identity checks ensure that items return to their rightful owners safely.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Clock size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Real-time Updates</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Get instant notifications when a match is found. Report items in seconds with our smart forms.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Smile size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Community First</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Join thousands of students and faculty helping each other. A lost item isn't lost forever.</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
