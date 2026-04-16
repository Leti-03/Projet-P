import React, { useState } from 'react';
import { Receipt, CreditCard, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';

const Field = ({ label, value }) => (
  <div>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <p style={{ margin: '3px 0 0', fontSize: 14, color: value ? '#1e293b' : '#cbd5e1', fontWeight: value ? 500 : 400 }}>
      {value || '—'}
    </p>
  </div>
);

function StatusBadge({ status }) {
  const map = {
    'Invoice Open': { bg: '#fef3c7', color: '#92400e', icon: Clock, label: 'En attente' },
    'Invoice Closed': { bg: '#f0fdf4', color: '#16a34a', icon: CheckCircle, label: 'Réglée' },
    'Invoice Overdue': { bg: '#fef2f2', color: '#dc2626', icon: AlertCircle, label: 'En retard' },
  };
  const s = map[status] || { bg: '#f1f5f9', color: '#64748b', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {s.label}
    </span>
  );
}

export default function TabFacturation({ facturation }) {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  if (!facturation) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
        <Receipt size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
        <p>Aucune donnée de facturation disponible.</p>
      </div>
    );
  }

  const { resume, factures = [] } = facturation;

  const filteredFactures = factures.filter(f => {
    if (!dateDebut && !dateFin) return true;
    const d = new Date(f.date_facture);
    if (dateDebut && d < new Date(dateDebut)) return false;
    if (dateFin && d > new Date(dateFin)) return false;
    return true;
  });

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Résumé de compte */}
      {resume && (
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Résumé de compte</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { label: 'Balance totale', value: resume.balance_totale },
              { label: 'Facture impayée', value: resume.facture_impayee, highlight: true },
              { label: 'Méthode de paiement', value: resume.methode_paiement },
              { label: 'Crédit disponible', value: resume.montant_credit_disponible },
              { label: 'Type de cycle', value: resume.type_cycle_facturation },
              { label: 'Date d\'échéance', value: resume.date_echeance },
              { label: 'Montant crédit total', value: resume.montant_credit_total },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px' }}>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{item.label}</p>
                <p style={{ margin: '6px 0 0', fontSize: 16, fontWeight: 800, color: item.highlight ? '#fbbf24' : 'white' }}>{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtre de date */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Date début</label>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Date fin</label>
            <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
          </div>
          <button onClick={() => { setDateDebut(''); setDateFin(''); }}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Factures table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={14} color="white" />
          </div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Factures & Paiement de Factures</h3>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{filteredFactures.length} enregistrement(s)</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Type de facture', 'Montant', 'Montant ouvert', 'Fermé', 'État', 'Conflit', 'Date facture', 'Date échéance', 'Num facture', 'Cycle'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFactures.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                    Aucune facture trouvée pour cette période.
                  </td>
                </tr>
              ) : filteredFactures.map((f, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{f.type_facture}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e293b' }}>{f.montant}</td>
                  <td style={{ padding: '14px 16px', color: f.montant_ouvert !== '0,00DA' ? '#dc2626' : '#64748b' }}>{f.montant_ouvert}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{f.fermer_montant}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={f.etat_facture} /></td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{f.conflit_montant}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{f.date_facture}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{f.date_echeance}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>{f.num_facture}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{f.id_cycle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}