import React from 'react';

export default function TableauStats({ donnees }) {
  return (
    <div className="at-card" style={{ padding: '20px' }}>
      <h4 style={{ marginTop: 0, marginBottom: '20px' }}>Performance des Offres</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--at-border)', color: 'var(--at-text-sub)' }}>
            <th style={{ padding: '10px' }}>Offre</th>
            <th style={{ padding: '10px' }}>Ventes</th>
            <th style={{ padding: '10px' }}>Part</th>
          </tr>
        </thead>
        <tbody>
          {donnees.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f1f1' }}>
              <td style={{ padding: '12px 10px', fontWeight: '600' }}>{d.offre}</td>
              <td style={{ padding: '12px 10px' }}>{d.ventes}</td>
              <td style={{ padding: '12px 10px' }}>
                <div style={{ width: '100%', height: '6px', background: '#EDF2F7', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: d.part, height: '100%', background: 'var(--at-green)' }}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}