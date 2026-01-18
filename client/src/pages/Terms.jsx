import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '4rem 0', flex: 1, maxWidth: '800px' }}>
                <h2 className="section-title">Terms and Conditions</h2>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        By accessing or using FindIt, you agree to be bound by these Terms and Conditions. If you do not agree, you may not use our services.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. User Responsibilities</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        You are responsible for the accuracy of the information you provide when reporting lost or found items. You agree not to submit false claims or spam the platform.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. Limitation of Liability</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        FindIt is a platform to facilitate the return of lost items. We are not responsible for the items themselves or any disputes between users.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. Changes to Terms</h3>
                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
