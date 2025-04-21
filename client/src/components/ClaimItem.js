import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

function ClaimItem() {
  const { id } = useParams();
  const location = useLocation();
  const email = location.state?.email;

  const subject = encodeURIComponent("Claiming my lost item");
  const body = encodeURIComponent(`Hello,\n\nI believe this item belongs to me. Could you please help me with the next steps?\n\nThank you!`);
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Claim Item ID: {id}</h2>
      {email ? (
        <>
          <p>Please contact the item reporter at: <strong>{email}</strong></p>
          <a href={gmailLink} target="_blank" rel="noopener noreferrer">
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#D44638',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              📧 Contact via Gmail
            </button>
          </a>
        </>
      ) : (
        <p>Email not available. Did you navigate properly using state?</p>
      )}
    </div>
  );
}

export default ClaimItem;
