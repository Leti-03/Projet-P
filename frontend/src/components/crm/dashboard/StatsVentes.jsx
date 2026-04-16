import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const STATUT_CONFIG = {
  ouvert:     { label: 'Ouvert',     color: '#EF4444' },
  en_cours:   { label: 'En cours',   color: '#FF9800' },
  en_attente: { label: 'En attente', color: '#8B5CF6' },
  resolu:     { label: 'Résolu',     color: '#4CAF50' },
  ferme:      { label: 'Fermé',      color: '#718096' },
};

export default function StatsVentes({ repartition, agents, loading }) {
  const pieData = (repartition || [])
    .filter((d) => d.count > 0)
    .map((d) => ({
      name:  STATUT_CONFIG[d.statut]?.label || d.statut,
      value: d.count,
      color: STATUT_CONFIG[d.statut]?.color || '#718096',
    }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

      {/* Répartition réclamations */}
      <div className="at-card" style={{ padding: 24, cursor: 'default' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Réclamations par statut</h3>
        {loading ? (
          <div style={{ height: 140, background: '#F8FAFB', borderRadius: 12 }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={2}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #F0F2F4', fontFamily: 'Poppins' }} />
              </PieChart>
            </ResponsiveContainer>
            <ul style={{ flex: 1, listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pieData.map((d, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                    <span style={{ color: 'var(--at-text-sub)' }}>{d.name}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#1A202C' }}>{d.value}</span>
                </li>
              ))}
              {pieData.length === 0 && <li style={{ fontSize: 12, color: 'var(--at-text-sub)' }}>Aucune donnée</li>}
            </ul>
          </div>
        )}
      </div>

      {/* Top agents */}
      <div className="at-card" style={{ padding: 24, cursor: 'default' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Top agents ce mois</h3>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ height: 36, background: '#F0F2F4', borderRadius: 8 }} />)}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(agents || []).map((a, i) => (
              <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--at-text-sub)', width: 16 }}>{i + 1}</span>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#E8F5E9', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {a.nom.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1A202C' }}>{a.nom}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--at-text-sub)' }}>{a.resolues} résolues / {a.totalMois} traitées</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 60, height: 6, background: '#F0F2F4', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#4CAF50', borderRadius: 3, width: `${a.taux}%`, transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--at-text-sub)', minWidth: 30 }}>{a.taux}%</span>
                </div>
              </li>
            ))}
            {agents?.length === 0 && <li style={{ fontSize: 12, color: 'var(--at-text-sub)', textAlign: 'center', padding: '20px 0' }}>Aucune donnée</li>}
          </ul>
        )}
      </div>
    </div>
  );
}