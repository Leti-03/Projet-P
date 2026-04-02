// src/components/client/CarteDemandeService.jsx
import React from 'react';
import { Wifi, Phone, Router, Globe, Zap, ChevronRight, Clock } from 'lucide-react';

const SERVICE_CONFIG = {
  ligne_telephonique: { label: 'Ligne Téléphonique', icon: <Phone size={20}/>,  color: '#3B82F6', bg: '#EFF6FF' },
  adsl:               { label: 'Internet ADSL',      icon: <Wifi size={20}/>,   color: '#8B5CF6', bg: '#F5F3FF' },
  achat_modem:        { label: 'Achat Modem',        icon: <Router size={20}/>, color: '#F59E0B', bg: '#FFFBEB' },
  ip_fixe:            { label: '@IP Fixe',           icon: <Globe size={20}/>,  color: '#10B981', bg: '#ECFDF5' },
  fttx:               { label: 'FTTX (Fibre)',       icon: <Zap size={20}/>,    color: '#EF4444', bg: '#FEF2F2' },
};

const STATUT_CONFIG = {
  en_attente:  { label: 'Soumise',           color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B' },
  en_cours:    { label: 'En traitement',     color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', dot: '#3B82F6' },
  approuvee:   { label: 'Approuvée',         color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', dot: '#10B981' },
  rejetee:     { label: 'Rejetée',           color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', dot: '#EF4444' },
  terminee:    { label: 'Terminée',          color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', dot: '#9CA3AF' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function CarteDemandeService({ demande, onClick }) {
  const svc    = SERVICE_CONFIG[demande.type_service] || { label: demande.type_service, icon: <Globe size={20}/>, color: '#6B7280', bg: '#F9FAFB' };
  const statut = STATUT_CONFIG[demande.statut]        || STATUT_CONFIG.en_attente;

  return (
    <div className="cds-card" onClick={() => onClick(demande)}>

      {/* Bande colorée gauche */}
      <div className="cds-card-accent" style={{ background: svc.color }} />

      {/* Icône service */}
      <div className="cds-card-icon" style={{ background: svc.bg, color: svc.color }}>
        {svc.icon}
      </div>

      {/* Contenu principal */}
      <div className="cds-card-body">
        <div className="cds-card-service">{svc.label}</div>
        <div className="cds-card-id">#{String(demande.id).slice(0, 8).toUpperCase()}</div>
        {demande.wilaya && (
          <div className="cds-card-location">📍 {demande.wilaya}{demande.ville ? `, ${demande.ville}` : ''}</div>
        )}
      </div>

      {/* Statut */}
      <div className="cds-card-statut">
        <div className="cds-statut-badge" style={{ background: statut.bg, border: `1px solid ${statut.border}`, color: statut.color }}>
          <span className="cds-statut-dot" style={{ background: statut.dot }} />
          {statut.label}
        </div>
        <div className="cds-card-date">
          <Clock size={11}/> {formatDate(demande.created_at)}
        </div>
      </div>

      {/* Flèche */}
      <div className="cds-card-arrow">
        <ChevronRight size={18} />
      </div>
    </div>
  );
}

export { SERVICE_CONFIG, STATUT_CONFIG, formatDate };