import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchFoundItems, claimFoundItem } from '../api';

const FoundItems = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFoundItems()
            .then(res => {
                setItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching found items:', err);
                setLoading(false);
            });
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    const handleClaim = async (item) => {
        if (window.confirm(`Please contact the finder at: ${item.contact_info}\n\nClick OK to confirm you have contacted them and want to remove this item from the list.`)) {
            try {
                await claimFoundItem(item.id);
                alert("Item claimed and removed!");
                // Refresh list
                const res = await fetchFoundItems();
                setItems(res.data);
            } catch (err) {
                console.error("Error claiming item:", err);
                alert(`Failed to claim item: ${err.response?.data?.error || err.message}`);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container" style={{ padding: '4rem 20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 className="section-title" style={{ background: 'linear-gradient(to right, #ec4899, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Found Items</h2>
                        <p style={{ color: 'var(--text-dim)' }}>Browse items that have been found and reported.</p>
                    </div>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', outline: 'none' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>Loading items...</div>
                ) : filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>No items found.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                        {filteredItems.map(item => (
                            <div key={item.id} className="glass-panel" style={{ overflow: 'hidden', transition: 'var(--transition)' }}>
                                <div style={{ height: '200px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                    {item.image_url ? (
                                        <img src={item.image_url.startsWith('http') ? item.image_url : `${item.image_url}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.1)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>No Image</div>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{item.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <MapPin size={16} /> {item.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                        <Calendar size={16} /> {formatDate(item.date_found || item.created_at)}
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ width: '100%', justifyContent: 'space-between' }}
                                        onClick={() => handleClaim(item)}
                                    >
                                        Claim Item <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default FoundItems;
