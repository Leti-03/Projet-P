import React from 'react';
import { User, FileText, Wrench } from 'lucide-react';

const DernieresActivites = () => {
  const activites = [
    { id: 1, texte: "Nouveau client inscrit", cible: "Sarl Alpha", heure: "Il y a 10 min", icone: User, color: "var(--at-green)" },
    { id: 2, texte: "Facture générée", cible: "FAC-2026-04", heure: "Il y a 1h", icone: FileText, color: "#3182ce" },
    { id: 3, texte: "Intervention terminée", cible: "Hydra - Fibre", heure: "Il y a 3h", icone: Wrench, color: "var(--at-orange)" },
  ];

  return (
    <div className="at-card" style={{ padding: '20px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px' }}>Activités récentes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {activites.map((act) => (
          <div key={act.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: `${act.color}10`, color: act.color }}>
              <act.icone size={16} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{act.texte} <span style={{ color: 'var(--at-text-sub)' }}>({act.cible})</span></p>
              <span style={{ fontSize: '11px', color: '#A0AEC0' }}>{act.heure}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DernieresActivites;