import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TABS = [
  { key: 'clients',      label: 'Clients',     color: '#4CAF50' },
  { key: 'reclamations', label: 'Réclamations', color: '#EF4444' },
  { key: 'revenu',       label: 'Revenu (DA)',  color: '#FF9800' },
];

const CustomTooltip = ({ active, payload, label, activeTab }) => {
  if (!active || !payload?.length) return null;
  const tab = TABS.find((t) => t.key === activeTab);
  return (
    <div style={{ background: 'white', border: '1px solid #F0F2F4', borderRadius: 12, padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#1A202C' }}>{label}</p>
      <p style={{ margin: 0, color: tab?.color, fontWeight: 700 }}>{tab?.label} : {payload[0]?.value?.toLocaleString('fr-DZ')}</p>
    </div>
  );
};

export default function Graphique({ data, loading }) {
  const [activeTab, setActiveTab] = useState('clients');
  const tab = TABS.find((t) => t.key === activeTab);

  return (
    <div className="at-card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Évolution sur 12 mois</h3>
        <div style={{ display: 'flex', gap: 6, background: '#F0F2F4', borderRadius: 10, padding: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '6px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
                background: activeTab === t.key ? 'white' : 'transparent',
                color: activeTab === t.key ? t.color : 'var(--at-text-sub)',
                boxShadow: activeTab === t.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>
      {loading
        ? <div style={{ height: 220, background: '#F8FAFB', borderRadius: 12 }} />
        : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={tab.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={tab.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F4" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#718096', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#718096', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
              <Area type="monotone" dataKey={activeTab} stroke={tab.color} strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: tab.color }} />
            </AreaChart>
          </ResponsiveContainer>
        )
      }
    </div>
  );
}