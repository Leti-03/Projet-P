import React, { useState } from 'react';
import { Wifi, Cpu, Tag, BarChart2 } from 'lucide-react';

const Field = ({ label, value }) => (
  <div>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <p style={{ margin: '3px 0 0', fontSize: 14, color: value ? '#1e293b' : '#cbd5e1', fontWeight: value ? 500 : 400 }}>
      {value || '—'}
    </p>
  </div>
);

const INNER_TABS = [
  { key: 'info', label: "Info d'abonné" },
  { key: 'offre', label: 'Offre' },
  { key: 'terminal', label: 'Info sur le terminal' },
  { key: 'historique', label: 'Historique d\'état' },
];

export default function TabAbonne({ abonnes }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [innerTab, setInnerTab] = useState('info');

  if (!abonnes || abonnes.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
        <Wifi size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
        <p>Aucun abonné associé à ce client.</p>
      </div>
    );
  }

  const abonne = abonnes[selectedIdx];

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Subscriber list */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {abonnes.map((ab, i) => (
          <button key={i} onClick={() => { setSelectedIdx(i); setInnerTab('info'); }}
            style={{
              padding: '10px 18px', borderRadius: 12, border: '1.5px solid',
              borderColor: i === selectedIdx ? '#2563eb' : '#e2e8f0',
              background: i === selectedIdx ? '#eff6ff' : 'white',
              color: i === selectedIdx ? '#2563eb' : '#64748b',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
            <Wifi size={14} />
            {ab.num_service}
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: ab.flag_paiement === 'Postpayé' ? '#eff6ff' : '#f0fdf4', color: ab.flag_paiement === 'Postpayé' ? '#2563eb' : '#16a34a' }}>
              {ab.flag_paiement}
            </span>
          </button>
        ))}
      </div>

      {/* Inner tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: '#f8fafc', borderRadius: 12, padding: 4 }}>
        {INNER_TABS.map(t => (
          <button key={t.key} onClick={() => setInnerTab(t.key)}
            style={{
              flex: 1, padding: '9px 12px', borderRadius: 9, border: 'none',
              background: innerTab === t.key ? 'white' : 'transparent',
              color: innerTab === t.key ? '#1e293b' : '#94a3b8',
              fontWeight: innerTab === t.key ? 700 : 500, fontSize: 13, cursor: 'pointer',
              boxShadow: innerTab === t.key ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 24 }}>

        {innerTab === 'info' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wifi size={16} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Info d'abonné</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
              <Field label="Num service" value={abonne.num_service} />
              <Field label="Flag paiement" value={abonne.flag_paiement} />
              <Field label="État" value={abonne.etat} />
              <Field label="Type d'abonné" value={abonne.type_abonne} />
              <Field label="Groupe d'abonnés" value={abonne.groupe_abonnes} />
              <Field label="Offre primaire" value={abonne.offre_primaire} />
              <Field label="Code compte par défaut" value={abonne.code_compte_defaut} />
              <Field label="Nom groupe" value={abonne.nom_groupe} />
            </div>
          </>
        )}

        {innerTab === 'offre' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={16} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Offre</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
              <Field label="Offre primaire" value={abonne.offre_primaire} />
              <Field label="Type d'abonné" value={abonne.type_abonne} />
              <Field label="Groupe d'abonnés" value={abonne.groupe_abonnes} />
            </div>
          </>
        )}

        {innerTab === 'terminal' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #065f46, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={16} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Info sur le terminal de l'abonné</h3>
            </div>
            {abonne.terminal ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
                <Field label="Modèle" value={abonne.terminal.modele} />
                <Field label="NS" value={abonne.terminal.ns} />
                <Field label="MAC" value={abonne.terminal.mac} />
                <Field label="Créer un rendez-vous" value={abonne.terminal.rendez_vous} />
                <Field label="Opérateur" value={abonne.terminal.operateur} />
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Aucun terminal enregistré.</p>
            )}
          </>
        )}

        {innerTab === 'historique' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #92400e, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={16} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Historique d'état</h3>
            </div>
            {abonne.historique_etat && abonne.historique_etat.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {abonne.historique_etat.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
                    <p style={{ margin: 0, flex: 1, fontSize: 14, color: '#1e293b' }}>{h.etat}</p>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{h.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Aucun historique disponible.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}