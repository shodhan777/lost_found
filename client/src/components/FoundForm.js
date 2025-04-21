import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FoundForm.css';

const FoundForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateFound, setDateFound] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [userId] = useState(1);
  const [message, setMessage] = useState('');
  const [matchesFound, setMatchesFound] = useState(false);
  const [firstMatch, setFirstMatch] = useState(null);

  const navigate = useNavigate();

  // Handle image upload
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImageUrl = await handleImageUpload();

    const foundItem = {
      title,
      description,
      location,
      date_found: dateFound,
      image_url: uploadedImageUrl,
      user_id: userId,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/items/found', foundItem);
      setMessage(res.data.message);

      if (res.data.matches && res.data.matches.length > 0) {
        setMatchesFound(true);
        setFirstMatch(res.data.matches[0]);
      } else {
        setMatchesFound(false);
        setFirstMatch(null);
      }
    } catch (err) {
      console.error('Error submitting found item:', err);
      setMessage('Error submitting item. Please try again.');
    }
  };

  // Handle image file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFileName(file ? file.name : '');
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  // Navigate to matches
  const handleNavigateToMatches = () => {
    navigate('/matches');
  };

  return (
    <div className="form-container">
      <h2>Report Found Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Found Date</label>
        <input type="date" value={dateFound} onChange={(e) => setDateFound(e.target.value)} required />

        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {fileName && <p className="file-name">Selected file: {fileName}</p>}
        {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      {matchesFound && firstMatch && (
        <div className="matches-container">
          <h3>Match Found!</h3>
          <p><strong>Lost:</strong> {firstMatch.lost_title} - {firstMatch.lost_location}</p>
          <div className="match-images-container">
            <img src={firstMatch.lost_image_url} alt="Lost" className="match-image" />
            <img src={firstMatch.found_image_url} alt="Found" className="match-image" />
          </div>
          <p><strong>Found:</strong> {firstMatch.found_title} - {firstMatch.found_location}</p>
          <button onClick={handleNavigateToMatches}>Go to Matches</button>
        </div>
      )}
    </div>
  );
};

export default FoundForm;
