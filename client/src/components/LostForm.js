import React, { useState } from 'react';
import axios from 'axios';
import './LostForm.css';

function LostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date_lost: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await axios.post('http://localhost:5000/api/items/upload', formData);
      return res.data.imageUrl;
    } catch (err) {
      console.error('Image upload failed:', err);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedImageUrl = await handleImageUpload();

      const lostItem = {
        ...formData,
        image_url: uploadedImageUrl,
      };

      const res = await axios.post('http://localhost:5000/api/items/lost', lostItem);
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

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LostForm;
