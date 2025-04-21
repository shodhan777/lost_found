import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchResults.css';

function MatchedResults() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items/matches');
        setMatches(res.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, []);

  const handleClaim = async (matchId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/items/match/${matchId}/claim`);
      if (response.status === 200) {
        alert('Claim successful');
        // Update status in UI
        setMatches(prevMatches =>
          prevMatches.map(match =>
            match.match_id === matchId ? { ...match, status: 'claimed' } : match
          )
        );
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
          .slice() // Create a shallow copy to avoid mutating the original array
          .reverse() // Reverse the array so the most recent match appears at the top
          .map((match) => (
            <div key={match.match_id} className="match-card" style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
              <h3>Lost Item</h3>
              <p><strong>Title:</strong> {match.lost_title}</p>
              <p><strong>Description:</strong> {match.lost_description}</p>
              <p><strong>Location:</strong> {match.lost_location}</p>
              {match.lost_image_url && (
                <img src={match.lost_image_url} alt="Lost item" style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px' }} />
              )}

              <h3>Found Item</h3>
              <p><strong>Title:</strong> {match.found_title}</p>
              <p><strong>Description:</strong> {match.found_description}</p>
              <p><strong>Location:</strong> {match.found_location}</p>
              {match.found_image_url && (
                <img src={match.found_image_url} alt="Found item" style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px' }} />
              )}

              <p><strong>Status:</strong> {match.status}</p>
              <p><strong>Status:</strong> {match.claim_status}</p>
              <p><strong>Matched On:</strong> {new Date(match.matched_on).toLocaleString()}</p>

              {/* ✅ Display contact email */}
              {match.user_email && (
                <p><strong>Contact Email:</strong> <a href={`mailto:${match.user_email}`}>{match.user_email}</a></p>
              )}

              {/* Claim Button */}
              {match.status !== 'claimed' && (
                <button onClick={() => handleClaim(match.match_id)} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
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
