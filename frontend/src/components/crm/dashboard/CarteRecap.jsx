import React from 'react';
import { Users, AlertCircle, Wrench, TrendingUp, ClipboardList } from 'lucide-react';

const CARDS = [
  { key: 'totalClients',         label: 'Clients actifs',         icon: Users,        color: '#4CAF50', bg: '#E8F5E9', moisKey: 'clientsMois',      moisLabel: (v) => `+${v} ce mois` },
  { key: 'reclamationsOuvertes', label: 'Réclamations ouvertes',  icon: AlertCircle,  color: '#EF4444', bg: '#FFEBEE', moisKey: 'reclamationsMois', moisLabel: (v) => `${v} ce mois` },
  { key: 'interventionsEnCours', label: 'Interventions en cours', icon: Wrench,       color: '#FF9800', bg: '#FFF3E0', moisKey: null },
  { key: 'demandesMois',         label: 'Nouvelles demandes',     icon: ClipboardList,color: '#8B5CF6', bg: '#EDE9FE', moisKey: null },
  { key: 'revenuMois',           label: 'Revenu encaissé (mois)', icon: TrendingUp,   color: '#4CAF50', bg: '#E8F5E9', moisKey: null, format: (v) => v.toLocaleString('fr-DZ') + ' DA' },
];

export default function CarteRecap({ data, loading }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
      {CARDS.map(({ key, label, icon: Icon, color, bg, moisKey, moisLabel, format }) => {
        const val     = data?.[key] ?? 0;
        const moisVal = moisKey ? (data?.[moisKey] ?? 0) : null;
        const displayed = format ? format(val) : val;

        return (
          <div key={key} className="at-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--at-text-sub)', fontWeight: 500 }}>{label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            {loading
              ? <div style={{ height: 28, background: '#F0F2F4', borderRadius: 8 }} />
              : <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color }}>{displayed}</p>
            }
            {moisLabel && moisVal !== null && !loading && (
              <p style={{ margin: 0, fontSize: 11, color: 'var(--at-text-sub)' }}>{moisLabel(moisVal)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}