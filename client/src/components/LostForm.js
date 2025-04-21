// src/components/LostForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './LostForm.css';

function LostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date_lost: '',
    image_url: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/items/lost', formData);
      setMessage(res.data.message || 'Lost item submitted successfully');
    } catch (err) {
      console.error('Error submitting lost item:', err);
      setMessage('Error submitting lost item');
    }
  };

  return (
    <div className="lost-form-container">
      <h2>Lost Item Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          placeholder="Item Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="location">Location</label>
        <input
          name="location"
          placeholder="Lost Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="date_lost">Date Lost</label>
        <input
          type="date"
          name="date_lost"
          value={formData.date_lost}
          onChange={handleChange}
          required
        />

        <label htmlFor="image_url">Image URL</label>
        <input
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LostForm;
  