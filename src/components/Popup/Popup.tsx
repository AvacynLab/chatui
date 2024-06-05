import React, { useState } from 'react';
import './Popup.scss'; // Importation du style pour la pop-up

// Composant de la pop-up explicative
const Popup = ({ children, text }: { children: React.ReactNode, text: string }) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  return (
    <div
      className={`popup ${isActive ? 'active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="popup-text">{text}</div>
      {children}
    </div>
  );
};

export default Popup;
