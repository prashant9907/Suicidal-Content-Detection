import React, { useEffect, useState } from 'react';
import '../Styles/WelcomeMessage.css';
import logo3 from './images.jpeg'

const WelcomeMessage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`welcome-message ${visible ? 'visible' : ''}`}>
      <div className="logo-container">
        <div className="logo left-logo animate-slide-right">
          <img src={logo3} alt="Indian Institute of Information Technology, Una(Himachal Pradesh)" />
        </div>
        <div className="welcome-content animate-fade-in">
          <h1>Welcome to</h1>
          <h2 className="company-name">Suicidal Content Detection</h2>
          <p className="tagline animate-pulse">Sponsored by IIIT Una</p>
        </div>
        {/* <div className="logo right-logo animate-slide-left">
          <img src={logo3} alt="latentForce.ai Logo" />
        </div> */}
      </div>
    </div>
  );
};

export default WelcomeMessage;