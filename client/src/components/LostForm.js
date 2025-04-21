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
  const [imagePreview, setImagePreview] = useState('');  // Preview for the image
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Create a preview of the image for the user
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const lostItemData = new FormData();

      // Append form data
      Object.keys(formData).forEach((key) => {
        lostItemData.append(key, formData[key]);
      });

      // Append image file if present
      if (imageFile) {
        lostItemData.append('image', imageFile);
      }

      // Submit the form with image data
      const res = await axios.post('http://localhost:5000/api/items/lost', lostItemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
          onChange={handleFileChange}
        />
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
          </div>
        )}

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LostForm;
