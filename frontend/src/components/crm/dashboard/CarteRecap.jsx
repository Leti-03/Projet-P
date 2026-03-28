import React from 'react';

const CarteRecap = ({ titre, valeur, icone: Icon, couleur }) => {
  return (
    <div className="at-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
      <div style={{ 
        width: '50px', height: '50px', borderRadius: '12px', 
        background: `${couleur}15`, color: couleur,
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--at-text-sub)', fontWeight: '500' }}>{titre}</p>
        <h2 style={{ margin: '5px 0 0 0', fontSize: '22px' }}>{valeur}</h2>
      </div>
    </div>
  );
};

export default CarteRecap;