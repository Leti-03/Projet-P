// src/components/crm/administration/GestionPermissions.jsx
import React from 'react';

const ACTIONS = ['read', 'create', 'update', 'delete'];

const ACTION_LABELS = {
  read:   { label: 'Lire',      color: '#3b82f6', bg: '#eff6ff' },
  create: { label: 'Créer',     color: '#10b981', bg: '#ecfdf5' },
  update: { label: 'Modifier',  color: '#f59e0b', bg: '#fffbeb' },
  delete: { label: 'Supprimer', color: '#ef4444', bg: '#fef2f2' },
};

// ressourceMatrice = [{ ressource_id, ressource_nom, permissions: [{ permission_id, action, active }] }]
// onToggle(permission_id, newValue) — appelé quand on coche/décoche
export default function GestionPermissions({ ressourceMatrice = [], onToggle, readOnly = false }) {

  if (!ressourceMatrice || ressourceMatrice.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontFamily: "'Poppins', sans-serif" }}>
        Aucune ressource disponible
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* En-tête colonnes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr repeat(4, 100px)',
        gap: 8,
        padding: '8px 16px',
        marginBottom: 4,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
          Ressource
        </div>
        {ACTIONS.map(action => (
          <div key={action} style={{
            fontSize: 11, fontWeight: 700, color: ACTION_LABELS[action].color,
            textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {ACTION_LABELS[action].label}
          </div>
        ))}
      </div>

      {/* Lignes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ressourceMatrice.map((ressource, idx) => {

          // Construire un map action → permission pour cette ressource
          const permMap = {};
          (ressource.permissions || []).forEach(p => {
            permMap[p.action] = p;
          });

          return (
            <div key={ressource.ressource_id || idx} style={{
              display: 'grid',
              gridTemplateColumns: '1fr repeat(4, 100px)',
              gap: 8,
              padding: '12px 16px',
              background: idx % 2 === 0 ? '#f8fafc' : 'white',
              borderRadius: 10,
              border: '1px solid #f1f5f9',
              alignItems: 'center',
            }}>

              {/* Nom ressource */}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                {ressource.ressource_nom}
              </div>

              {/* Cases par action */}
              {ACTIONS.map(action => {
                const perm = permMap[action];
                const isActive = perm?.active ?? false;
                const permId = perm?.permission_id;
                const missing = !perm; // La permission n'existe pas en BDD

                return (
                  <div key={action} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {missing ? (
                      // Permission inexistante en BDD → case grisée non cliquable
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        border: '2px solid #e2e8f0',
                        background: '#f1f5f9',
                        cursor: 'not-allowed',
                        title: 'Permission non configurée en base',
                      }} title="Non configuré en BDD" />
                    ) : readOnly ? (
                      // Mode lecture seule
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        border: `2px solid ${isActive ? ACTION_LABELS[action].color : '#e2e8f0'}`,
                        background: isActive ? ACTION_LABELS[action].bg : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isActive && (
                          <div style={{
                            width: 10, height: 10, borderRadius: 2,
                            background: ACTION_LABELS[action].color,
                          }} />
                        )}
                      </div>
                    ) : (
                      // Mode édition — case cliquable
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onToggle && onToggle(permId, !isActive)}
                        style={{
                          width: 18, height: 18,
                          accentColor: ACTION_LABELS[action].color,
                          cursor: 'pointer',
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div style={{
        display: 'flex', gap: 16, marginTop: 16, padding: '10px 16px',
        background: '#f8fafc', borderRadius: 8, flexWrap: 'wrap',
      }}>
        {ACTIONS.map(action => (
          <div key={action} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: ACTION_LABELS[action].color,
            }} />
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
              {ACTION_LABELS[action].label}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#e2e8f0', border: '1px solid #cbd5e1' }} />
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Non configuré en BDD</span>
        </div>
      </div>
    </div>
  );
}