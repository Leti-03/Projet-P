import React from 'react';

const Bouton = ({ children, onClick, type = "button", icon: Icon, style }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className="at-btn-green" // Utilise la classe de ton App.css
      style={{ ...style, width: 'auto' }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Bouton;