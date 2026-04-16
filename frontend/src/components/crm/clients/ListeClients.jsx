import React from 'react';
import Tableau from '../common/Tableau';
import { Building2, User, Mail, Phone, MapPin, Pencil, Trash2 } from 'lucide-react';

const StatutBadge = ({ statut }) => {
  const styles = {
    actif:    'badge-success',
    inactif:  'badge-error',
    suspendu: 'badge-pending',
  };
  return (
    <span className={`at-badge ${styles[statut] || 'badge-pending'}`}>
      {statut || 'inconnu'}
    </span>
  );
};

export default function ListeClients({ clients, loading, onEdit, onDelete }) {
  const colonnes = [
    {
      label: 'Type',
      render: (c) => c.categorie === 'corporate'
        ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#0070B8', fontWeight: 700, fontSize: 11 }}><Building2 size={13}/> Corporate</span>
        : <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#718096', fontWeight: 700, fontSize: 11 }}><User size={13}/> Grand Public</span>
    },
    {
      label: 'Client',
      render: (c) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1A1A1A' }}>{c.nom} {c.prenom}</div>
          {c.categorie === 'corporate' && c.entreprise && (
            <div style={{ fontSize: 11, color: '#0070B8', marginTop: 2 }}>🏢 {c.entreprise}</div>
          )}
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>#{String(c.id).slice(0, 8)}</div>
        </div>
      )
    },
    {
      label: 'Contact',
      render: (c) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4A5568' }}>
            <Mail size={12}/> {c.email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4A5568' }}>
            <Phone size={12}/> {c.telephone}
          </div>
        </div>
      )
    },
    {
      label: 'Localisation',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#718096' }}>
          <MapPin size={12}/> {c.wilaya || c.ville || '—'}
        </div>
      )
    },
    {
      label: 'Statut',
      render: (c) => <StatutBadge statut={c.statut_compte} />
    },
    {
      label: 'Actions',
      render: (c) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEdit && onEdit(c)}
            style={{
              padding: '6px 10px', borderRadius: 7,
              border: '1px solid #E2E8F0', background: 'white',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 4, fontSize: 12, fontWeight: 600, color: '#0070B8'
            }}
          >
            <Pencil size={13}/> Modifier
          </button>
          <button
            onClick={() => onDelete && onDelete(c)}
            style={{
              padding: '6px 10px', borderRadius: 7,
              border: '1px solid #fed7d7', background: '#FFF5F5',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 4, fontSize: 12, fontWeight: 600, color: '#c53030'
            }}
          >
            <Trash2 size={13}/> Supprimer
          </button>
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="at-card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
        Chargement...
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="at-card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
        Aucun client trouvé.
      </div>
    );
  }

  return <Tableau colonnes={colonnes} donnees={clients} />;
}