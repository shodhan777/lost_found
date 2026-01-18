import React, { useState } from 'react';
import API from '../api'; // Use configured API
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
  // userId is now handled by the backend via token
  const [message, setMessage] = useState('');
  const [matchesFound, setMatchesFound] = useState(false);
  const [firstMatch, setFirstMatch] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date_found', dateFound);
    // User ID is extracted from token in backend
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await API.post('/items/found', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFileName(file ? file.name : '');
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

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
          <button onClick={handleNavigateToMatches}>Go to Matches</button>
        </div>
      )}


    </div>
  );
};

export default FoundForm;
