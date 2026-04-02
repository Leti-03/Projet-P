import React from 'react';
import { Mail, Phone, Shield, Edit, Trash2 } from 'lucide-react';
import Tableau from '../common/Tableau';

export default function TableauEmployes({ employes }) {
  const colonnes = [
    {
      label: "Nom & Poste",
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--at-green-light)', color: 'var(--at-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {item.nom.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>{item.nom}</div>
            <div style={{ fontSize: '11px', color: 'var(--at-text-sub)' }}>{item.service || 'Non assigné'}</div>
          </div>
        </div>
      )
    },
    { 
      label: "Contact", 
      render: (item) => (
        <div style={{ fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={12}/> {item.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--at-text-sub)' }}><Phone size={12}/> {item.tel}</div>
        </div>
      )
    },
    { 
      label: "Rôle", 
      render: (item) => (
        <span style={{ 
          padding: '4px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold',
          background: item.role === 'ADMIN' ? '#FED7D7' : '#EBF8FF',
          color: item.role === 'ADMIN' ? '#C53030' : '#2B6CB0'
        }}>
          {item.role}
        </span>
      )
    },
    {
      label: "Actions",
      render: () => (
        <div style={{ display: 'flex', gap: '10px', color: 'var(--at-text-sub)' }}>
          <Edit size={16} style={{ cursor: 'pointer' }} />
          <Trash2 size={16} style={{ cursor: 'pointer' }} />
        </div>
      )
    }
  ];

  return <Tableau colonnes={colonnes} donnees={employes} />;
}