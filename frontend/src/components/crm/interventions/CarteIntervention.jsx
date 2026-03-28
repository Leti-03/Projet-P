import React from 'react';
import { MapPin, Calendar, Wrench } from 'lucide-react';

export default function CarteIntervention({ data }) {
  return (
    <div className="at-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span className="at-badge badge-pending">{data.type}</span>
        <Wrench size={16} color="var(--at-text-sub)" />
      </div>
      <h4 style={{ margin: '0 0 10px 0' }}>{data.client}</h4>
      <p style={{ fontSize: '13px', color: 'var(--at-text-sub)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <MapPin size={14} /> {data.adresse}
      </p>
      <hr style={{ border: '0', borderTop: '1px solid var(--at-border)', margin: '15px 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
        <Calendar size={14} /> Prévu le {data.date}
      </div>
    </div>
  );
}