import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function CarteFacture({ id, montant, statut }) {
  return (
    <div className="at-card" style={{ padding: '15px', borderLeft: `4px solid ${statut === 'Payée' ? 'var(--at-green)' : 'var(--at-orange)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--at-text-sub)' }}>{id}</p>
          <h3 style={{ margin: '5px 0' }}>{montant} DA</h3>
        </div>
        <Download size={18} style={{ cursor: 'pointer', color: 'var(--at-text-sub)' }} />
      </div>
    </div>
  );
}