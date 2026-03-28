import React from 'react';
import { User, MapPin, Phone, Mail } from 'lucide-react';

export default function CarteClient({ client }) {
  return (
    <div className="at-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--at-green-light)', color: 'var(--at-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={24} />
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{client.entreprise}</h4>
          <span style={{ fontSize: '12px', color: 'var(--at-text-sub)' }}>ID: #{client.id}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14}/> {client.ville}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14}/> {client.email}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14}/> {client.tel}</div>
      </div>
    </div>
  );
}