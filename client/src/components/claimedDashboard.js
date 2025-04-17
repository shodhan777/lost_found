import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClaimedDashboard = () => {
  const [claimedMatches, setClaimedMatches] = useState([]);

  useEffect(() => {
    const fetchClaimed = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items/claimed');
        setClaimedMatches(res.data);
      } catch (err) {
        console.error('Error fetching claimed matches:', err);
      }
    };

    fetchClaimed();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Claimed Items Dashboard</h2>
      {claimedMatches.length === 0 ? (
        <p>No claimed matches yet.</p>
      ) : (
        <ul>
          {claimedMatches.map(match => (
            <li key={match.match_id} style={{ marginBottom: '10px' }}>
              <strong>Lost Item:</strong> {match.lost_title} - {match.lost_description}<br />
              <strong>Found Item:</strong> {match.found_title} - {match.found_description}<br />
              <strong>Claimed On:</strong> {new Date(match.matched_on).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClaimedDashboard;
