import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CarteStat({ titre, valeur, progression, estPositif = true }) {
  return (
    <div className="at-card" style={{ padding: '20px' }}>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--at-text-sub)', fontWeight: '600' }}>{titre}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '24px' }}>{valeur}</h2>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center',
          color: estPositif ? 'var(--at-green)' : '#E53E3E' 
        }}>
          {estPositif ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {progression}
        </span>
      </div>
    </div>
  );
}