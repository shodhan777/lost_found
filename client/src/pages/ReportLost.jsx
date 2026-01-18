import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reportLostItem } from '../api';

const ReportLost = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        date: '',
        time: '',
        contact: '',
        description: '',
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            await reportLostItem(data);
            alert('Report submitted successfully! We will notify you if a match is found.');
            navigate('/lost');
        } catch (err) {
            console.error('Error reporting item:', err);
            alert('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '4rem 0', flex: 1, maxWidth: '800px' }}>
                <h2 className="section-title">Report Lost Item</h2>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Item Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="e.g. Red Notebook" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date Lost</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Time</label>
                                    <input type="time" name="time" value={formData.time} onChange={handleChange} required style={inputStyle} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location Lost</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} placeholder="e.g. Near Library" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contact Info</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required style={inputStyle} placeholder="Email or Phone" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={inputStyle} placeholder="Provide details like color, scratches, etc."></textarea>
                        </div>

                        <div style={{ border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                            {preview ? (
                                <div style={{ position: 'relative', height: '150px' }}>
                                    <img src={preview} alt="Preview" style={{ height: '100%', borderRadius: '8px' }} />
                                    <button type="button" onClick={(e) => { e.preventDefault(); setPreview(null); setImage(null); }} style={{ position: 'absolute', top: '-10px', right: 'calc(50% - 85px)', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>x</button>
                                </div>
                            ) : (
                                <>
                                    <Upload style={{ margin: '0 auto 10px', color: 'var(--text-dim)' }} />
                                    <p style={{ color: 'var(--text-dim)' }}>Click to upload image</p>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setFormData({ name: '', location: '', date: '', time: '', contact: '', description: '' })}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
};

export default ReportLost;
