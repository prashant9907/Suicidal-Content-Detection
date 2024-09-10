import React, { useState, useEffect } from 'react';
import '../Styles/Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`}>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} by IIITU.ac.in </p>
      </div>
    </footer>
  );
};

export default Footer;