import React from 'react';
import { useLocation } from 'react-router-dom';

function ClaimItem() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Contact the Reporter</h2>
      {email ? (
        <p>
          Click below to contact: <br />
          <a href={`mailto:${email}`} style={{ fontWeight: 'bold', color: 'blue' }}>
            {email}
          </a>
        </p>
      ) : (
        <p>Email not found.</p>
      )}
    </div>
  );
}

export default ClaimItem;
