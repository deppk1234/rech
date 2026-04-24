import React from 'react';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{color: '#28a745'}}>Congratulations!</h2>
      <p>Your account is verified. You can now claim your free recharge.</p>
      
      <div style={{ border: '1px solid #ddd', padding: '20px', display: 'inline-block', borderRadius: '8px' }}>
        <input type="text" placeholder="Enter Mobile Number" style={{padding: '10px'}} />
        <button style={{padding: '10px', background: '#28a745', color: '#fff', border: 'none', marginLeft: '5px'}}>
          Recharge Now
        </button>
      </div>
    </div>
  );
}

export default Home;