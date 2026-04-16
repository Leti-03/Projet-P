import React from 'react';

const ACTION_COLORS = {
  CREATE: { bg: '#E8F5E9', color: '#2E7D32' },
  UPDATE: { bg: '#E3F2FD', color: '#1565C0' },
  DELETE: { bg: '#FFEBEE', color: '#D32F2F' },
  LOGIN:  { bg: '#EDE9FE', color: '#6D28D9' },
};

const getStyle = (action) => {
  const key = Object.keys(ACTION_COLORS).find((k) => action?.toUpperCase().includes(k));
  return ACTION_COLORS[key] || { bg: '#F0F2F4', color: '#718096' };
};

const initiales = (util) => {
  if (!util) return '?';
  return `${util.prenom?.[0] ?? ''}${util.nom?.[0] ?? ''}`.toUpperCase() || '?';
};

const timeAgo = (isoString) => {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60)    return "à l'instant";
  if (diff < 3600)  return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
};

export default function DernieresActivites({ data, loading }) {
  return (
    <div className="at-card" style={{ padding: 24, cursor: 'default' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Dernières activités</h3>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0F2F4' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 12, background: '#F0F2F4', borderRadius: 6, width: '70%' }} />
                <div style={{ height: 10, background: '#F8FAFB', borderRadius: 6, width: '45%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 280, overflowY: 'auto' }}>
          {(data || []).map((activite) => {
            const s = getStyle(activite.action);
            return (
              <li key={activite.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4CAF50', flexShrink: 0 }}>
                  {initiales(activite.utilisateurs_internes)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, fontWeight: 700 }}>
                      {activite.action}
                    </span>
                    {activite.ressource && (
                      <span style={{ fontSize: 12, color: 'var(--at-text-sub)' }}>{activite.ressource}</span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--at-text-sub)' }}>
                    {activite.utilisateurs_internes
                      ? `${activite.utilisateurs_internes.prenom} ${activite.utilisateurs_internes.nom}`
                      : 'Système'} · {timeAgo(activite.date_action)}
                  </p>
                </div>
              </li>
            );
          })}
          {data?.length === 0 && (
            <li style={{ textAlign: 'center', padding: '30px 0', color: 'var(--at-text-sub)', fontSize: 13 }}>Aucune activité récente</li>
          )}
        </ul>
      )}
    </div>
  );
}