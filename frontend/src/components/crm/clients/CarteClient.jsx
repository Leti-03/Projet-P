import React from 'react';
import { User, Building2, MapPin, Phone, Mail, Pencil, Trash2 } from 'lucide-react';

const StatutBadge = ({ statut }) => {
  const styles = {
    actif:    { background: '#F0FFF4', color: '#22863a', border: '1px solid #c3e6cb' },
    inactif:  { background: '#FFF5F5', color: '#c53030', border: '1px solid #fed7d7' },
    suspendu: { background: '#FFFBEB', color: '#b45309', border: '1px solid #fde68a' },
  };
  return (
    <span style={{
      ...(styles[statut] || styles.inactif),
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: 0.5
    }}>
      {statut || 'inconnu'}
    </span>
  );
};

export default function CarteClient({ client, onEdit, onDelete }) {
  const isCorporate = client.categorie === 'corporate';

  return (
    <div className="at-card" style={{ padding: '20px', position: 'relative' }}>

      {/* ── En-tête ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
        <div style={{
          width: 45, height: 45, borderRadius: 12, flexShrink: 0,
          background: isCorporate ? '#EFF6FF' : 'var(--at-green-light)',
          color: isCorporate ? '#0070B8' : 'var(--at-green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isCorporate ? <Building2 size={22}/> : <User size={22}/>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {client.nom} {client.prenom}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: 'var(--at-text-sub)' }}>#{String(client.id).slice(0, 8)}</span>
            <StatutBadge statut={client.statut_compte} />
          </div>
        </div>
      </div>

      {/* ── Infos corporate ── */}
      {isCorporate && client.entreprise && (
        <div style={{
          padding: '6px 10px', background: '#EFF6FF', borderRadius: 7,
          fontSize: 12, fontWeight: 700, color: '#0070B8', marginBottom: 10
        }}>
          🏢 {client.entreprise}
        </div>
      )}

      {/* ── Coordonnées ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4A5568' }}>
          <MapPin size={14} color="var(--at-green)"/> {client.wilaya || client.ville || '—'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4A5568' }}>
          <Mail size={14} color="var(--at-green)"/> {client.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4A5568' }}>
          <Phone size={14} color="var(--at-green)"/> {client.telephone}
        </div>
      </div>

      {/* ── Actions ── */}
      {(onEdit || onDelete) && (
        <div style={{
          display: 'flex', gap: 8, marginTop: 14,
          paddingTop: 12, borderTop: '1px solid #F0F2F4'
        }}>
          {onEdit && (
            <button onClick={() => onEdit(client)} style={{
              flex: 1, padding: '7px', borderRadius: 7,
              border: '1px solid #E2E8F0', background: 'white',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#0070B8'
            }}>
              <Pencil size={13}/> Modifier
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(client)} style={{
              flex: 1, padding: '7px', borderRadius: 7,
              border: '1px solid #fed7d7', background: '#FFF5F5',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#c53030'
            }}>
              <Trash2 size={13}/> Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
}