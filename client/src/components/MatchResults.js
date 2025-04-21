import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchResults.css';
import { useNavigate } from 'react-router-dom';

function MatchedResults() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items/matches');
        console.log(res.data); // Debugging: log the response
        setMatches(res.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, []);

  const handleClaim = async (matchId, email) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/items/match/${matchId}/claim`);
      if (response.status === 200) {
        alert('Claim successful');
        navigate(`/claim/${matchId}`, { state: { email } });
      }
    } catch (err) {
      console.error('Error claiming the match:', err);
    }
  };

  return (
    <div className="matched-results">
      <h2>Matched Lost and Found Items</h2>
      {matches.length === 0 ? (
        <p>No matches found yet.</p>
      ) : (
        matches
          .slice()
          .reverse()
          .map((match) => (
            <div key={match.match_id} className="match-card">
              <h3>Lost Item</h3>
              <p><strong>Title:</strong> {match.lost_title}</p>
              <p><strong>Description:</strong> {match.lost_description}</p>
              <p><strong>Location:</strong> {match.lost_location}</p>
              {match.lost_image && (
                <img
                  src={`http://localhost:5000/uploads/${match.lost_image}`}
                  alt="Lost item"
                  className="match-item-image"
                />
              )}

              <h3>Found Item</h3>
              <p><strong>Title:</strong> {match.found_title}</p>
              <p><strong>Description:</strong> {match.found_description}</p>
              <p><strong>Location:</strong> {match.found_location}</p>
              {match.found_image && (
                <img
                  src={`http://localhost:5000/uploads/${match.found_image}`}
                  alt="Found item"
                  className="match-item-image"
                />
              )}

              <p><strong>Status:</strong> {match.claim_status}</p>
              <p><strong>Matched On:</strong> {new Date(match.matched_on).toLocaleString()}</p>

              {match.user_email && (
                <p><strong>Contact Email:</strong> <a href={`mailto:${match.user_email}`}>{match.user_email}</a></p>
              )}

              {match.status !== 'claimed' && (
                <button
                  onClick={() => handleClaim(match.match_id, match.user_email)}
                  className="contact-button"
                >
                  Claim Item
                </button>
              )}
              <hr />
            </div>
          ))
      )}
    </div>
  );
}

export default MatchedResults;
