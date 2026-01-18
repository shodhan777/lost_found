import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchUserProfile, fetchUserHistory, updateUserProfile } from '../api';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get current user ID from local storage (set during login)
    const getUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) { return null; }
    };
    const user = getUser();

    useEffect(() => {
        if (user && user.id) {
            setLoading(true);
            Promise.all([
                fetchUserProfile(user.id),
                fetchUserHistory(user.id)
            ]).then(([profileRes, historyRes]) => {
                setProfile(profileRes.data);
                setHistory(historyRes.data);
                setLoading(false);
            }).catch(err => {
                console.error('Error fetching profile:', err);
                setLoading(false);
            });
        }
    }, []);

    const handleSave = () => {
        if (!profile) return;

        updateUserProfile(profile.id, { name: profile.name, contact_info: profile.contact_info })
            .then(() => {
                setIsEditing(false);
                alert('Profile updated successfully!');
            })
            .catch(err => alert('Failed to update profile.'));
    };

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div className="container" style={{ padding: '4rem', color: 'white', textAlign: 'center' }}>
                    Please login to view your profile.
                </div>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return <div className="container" style={{ padding: '4rem', color: 'white' }}>Loading...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h2 className="section-title">My Profile</h2>

                {/* Profile Card */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                        {profile?.name?.charAt(0) || 'U'}
                    </div>

                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Full Name</label>
                                {isEditing ? (
                                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
                                ) : (
                                    <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{profile.name}</div>
                                )}
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>ID Number</label>
                                <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{profile.id_number} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>(Cannot Change)</span></div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Role</label>
                                <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{profile.role}</div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Contact</label>
                                {isEditing ? (
                                    <input type="text" value={profile.contact_info} onChange={(e) => setProfile({ ...profile, contact_info: e.target.value })} style={inputStyle} />
                                ) : (
                                    <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{profile.contact_info || 'N/A'}</div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {isEditing ? (
                                <>
                                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                </>
                            ) : (
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <h3 style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1.5rem' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No recent activity.</p>}
                    {history.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontWeight: '600' }}>
                                    {item.type === 'lost' ? 'Reported Lost: ' : 'Reported Found: '}
                                    {item.name}
                                </h4>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    Reported on {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <span style={{
                                color: item.status === 'resolved' || item.status === 'claimed' ? '#10b981' : 'var(--primary)',
                                fontWeight: '500'
                            }}>
                                Status: {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
};

export default Profile;
