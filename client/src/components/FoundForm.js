import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FoundForm.css';

const FoundForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateFound, setDateFound] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [userId, setUserId] = useState(1); // Replace with dynamic user ID when auth added
  const [message, setMessage] = useState('');
  const [matchesFound, setMatchesFound] = useState(false); // To track if matches are found

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundItem = {
      title,
      description,
      location,
      date_found: dateFound,
      image_url: imageUrl,
      user_id: userId,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/items/found', foundItem);
      console.log("Backend Response:", res.data); // Log the response to check the matches
      setMessage(res.data.message);
      setMatchesFound(res.data.matches && res.data.matches.length > 0); // Check if any matches were found
    } catch (err) {
      console.error('Error submitting found item:', err);
      setMessage('Error submitting item. Please try again.');
    }
  };

  const handleNavigateToMatches = () => {
    navigate('/matches');
  };

  return (
    <div className="form-container">
      <h2>Report Found Item</h2>
      <form onSubmit={handleSubmit}>
      <label htmlFor="Title">Title</label>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label htmlFor="Description">Description</label>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="location">Location</label>
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <label htmlFor="date">Found Date</label>
        <input
           type="date"
            id="date"
            value={dateFound}
          onChange={(e) => setDateFound(e.target.value)}
          required
          />
        <label htmlFor="Image">Image</label>
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      {matchesFound && (
        <div className="matches-container">
          <h3>Match Found!</h3>
          <button onClick={handleNavigateToMatches} className="navigate-button">Go to Matches</button>
        </div>
      )}
    </div>
  );
};

export default FoundForm;
