// import React, { useState, useEffect } from 'react';
// import '../Styles/Footer.css';

// const Footer = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <footer className={`footer ${isVisible ? 'visible' : ''}`}>
//       <div className="footer-content">
//         <p>&copy; {new Date().getFullYear()} by IIITU.ac.in </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
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
        <div className="contact-info">
          <a href="mailto:karwasraprashant10@gmail.com" className="contact-item">
            <Mail size={18} />
            <span>karwasraprashant10@gmail.com</span>
          </a>
          <a href="https://www.linkedin.com/in/prashant-karwasra-91b832240/" target="_blank" rel="noopener noreferrer" className="contact-item">
            <Linkedin size={18} />
            <span>LinkedIn Profile</span>
          </a>
          <a href="https://github.com/prashant9907" target="_blank" rel="noopener noreferrer" className="contact-item">
            <Github size={18} />
            <span>GitHub Profile</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;