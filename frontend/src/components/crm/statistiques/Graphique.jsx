import React from 'react';

export default function Graphique({ titre }) {
  return (
    <div className="at-card" style={{ padding: '25px', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 20px 0' }}>{titre}</h3>
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(to bottom, #f8fafc, #ffffff)', 
        border: '1px dashed #E2E8F0', 
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Simulation de barres de graphique */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '60%' }}>
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} style={{ width: '30px', height: `${h}%`, background: 'var(--at-green)', borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
            ))}
        </div>
        <p style={{ position: 'absolute', bottom: '10px', fontSize: '12px', color: '#A0AEC0' }}>Données analytiques 2026</p>
      </div>
    </div>
  );
}