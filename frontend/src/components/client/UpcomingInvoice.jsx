import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UpcomingInvoice() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) { setLoading(false); return; }
    axios.get(`http://localhost:5000/api/client/factures/${user.id}`)
      .then(res => setFactures(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statutColor = { impayee: '#f39c12', payee: '#006837', en_retard: '#e74c3c', annulee: '#999' };
  const prochaine = factures.find(f => f.statut === 'impayee') || factures[0];

  return (
    <div style={{ background: 'white', borderRadius: 20, padding: '22px 24px', border: '1px solid #E8EDE8', height: '100%' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>💳 Facturation</div>
      {loading ? (
        <div style={{ color: '#999', fontSize: 13 }}>Chargement...</div>
      ) : !prochaine ? (
        <div style={{ color: '#999', fontSize: 13 }}>Aucune facture</div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#666' }}>{prochaine.numero_facture}</span>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, color: 'white', fontWeight: 600, background: statutColor[prochaine.statut] || '#999' }}>
              {prochaine.statut}
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            {parseFloat(prochaine.montant_ttc).toFixed(2)} <span style={{ fontSize: 14, color: '#666' }}>DZD</span>
          </div>
          {prochaine.date_echeance && (
            <div style={{ fontSize: 12, color: '#999' }}>Échéance : {new Date(prochaine.date_echeance).toLocaleDateString('fr-DZ')}</div>
          )}
          <div style={{ marginTop: 14, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Historique</div>
            {factures.slice(0, 3).map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid #f8f8f8' }}>
                <span style={{ color: '#555' }}>{f.numero_facture}</span>
                <span style={{ color: statutColor[f.statut], fontWeight: 600 }}>{parseFloat(f.montant_ttc).toFixed(2)} DZD</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}