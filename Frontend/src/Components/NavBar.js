import React from 'react';
import '../Styles/NavBar.css';
import { Home, FileText, Video, Code, FilePlus } from 'lucide-react';

function NavBar({ onNavClick, activeTab }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'document-upload', icon: FileText, label: 'Document Upload' },
    { id: 'chat-bot', icon: FileText, label: 'Chat' },
    // { id: 'image-video-upload', icon: Video, label: 'Image Video Upload'},

  ];

  return (
    <nav className="navbar">
      <ul className="nav-items">
        {navItems.map((item) => (
          <li key={item.id} className={activeTab === item.id ? 'active' : ''}>
            <button onClick={() => onNavClick(item.id)} title={item.label}>
              <item.icon size={24} />
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;