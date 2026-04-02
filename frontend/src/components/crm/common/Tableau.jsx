import React from 'react';

const Tableau = ({ colonnes, donnees }) => {
  return (
    <div className="at-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--at-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#F8FAFB', borderBottom: '1px solid var(--at-border)' }}>
          <tr>
            {colonnes.map((col, i) => (
              <th key={i} style={{ 
                padding: '16px 24px', 
                fontSize: '12px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px', 
                color: 'var(--at-text-sub)', 
                fontWeight: 600 
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {donnees.length > 0 ? donnees.map((ligne, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--at-border)', transition: '0.2s' }}>
              {colonnes.map((col, j) => (
                <td key={j} style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--at-text-main)' }}>
                  {col.render ? col.render(ligne) : ligne[col.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={colonnes.length} style={{ padding: '40px', textAlign: 'center', color: 'var(--at-text-sub)' }}>
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tableau;