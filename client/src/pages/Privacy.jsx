import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '4rem 0', flex: 1, maxWidth: '800px' }}>
                <h2 className="section-title">Privacy Policy</h2>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>1. Information Collection</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        We collect information you provide directly to us when you create an account, report a lost or found item, or communicate with us. This may include your name, email address, phone number, and details about lost/found items.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>2. Use of Information</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        We use the information we collect to provide, maintain, and improve our services, including matching lost items with found items and facilitating communication between users.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. Data Security</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>4. Contact Us</h3>
                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        If you have any questions about this Privacy Policy, please contact us at shishird003@gmail.com.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Privacy;
