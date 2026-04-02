import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function GestionPermissions({ roleSelect, permissionsMap }) {
  return (
    <div className="at-card" style={{ padding: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Matrice des droits : {roleSelect}</h3>
        <span style={{ fontSize: '12px', color: 'var(--at-green)', fontWeight: 'bold' }}>Mode Lecture Seule</span>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {permissionsMap.map((perm, idx) => (
          <div key={idx} style={{ 
            display: 'flex', justifyContent: 'space-between', padding: '12px', 
            background: '#F8FAFC', borderRadius: '8px', alignItems: 'center' 
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{perm.label}</span>
            {perm.autorise ? (
              <ShieldCheck size={18} color="var(--at-green)" />
            ) : (
              <ShieldAlert size={18} color="#E53E3E" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}