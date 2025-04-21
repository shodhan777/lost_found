import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

function ClaimItemPage() {
  const { matchId } = useParams();
  const location = useLocation();
  const email = location.state?.email;

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

  return (
    <div style={{ padding: '30px' }}>
      <h2>Claim Item #{matchId}</h2>
      {email ? (
        <>
          <p><strong>Contact Email:</strong> {email}</p>
          <a href={gmailLink} target="_blank" rel="noopener noreferrer">
            <button style={{ padding: '10px 15px', backgroundColor: '#0072c6', color: 'white', border: 'none', cursor: 'pointer' }}>
              Contact via Gmail
            </button>
          </a>
        </>
      ) : (
        <p>Email not available</p>
      )}
    </div>
  );
}

export default ClaimItemPage;
