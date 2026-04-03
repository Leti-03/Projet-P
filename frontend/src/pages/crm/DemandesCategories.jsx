// src/pages/crm/DemandesCategories.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Phone, Router, Globe, Zap, ChevronRight, Clock, Loader, AlertCircle } from 'lucide-react';
import Layout from '../../components/crm/common/Layout';
import { useDemandesStats } from '../../hooks/crm/useDemandes';

const SERVICE_CONFIG = [
  { value: 'ligne_telephonique', label: 'Ligne Téléphonique',   icon: Phone,  desc: 'Demandes de création et modification de lignes fixes' },
  { value: 'adsl',               label: 'Internet ADSL',        icon: Wifi,   desc: "Abonnements ADSL et changements d'offres" },
  { value: 'achat_modem',        label: 'Achat Modem',          icon: Router, desc: 'Commandes et remplacement de matériel réseau' },
  { value: 'ip_fixe',            label: '@IP Fixe',             icon: Globe,  desc: "Attribution d'adresses IP fixes pour entreprises" },
  { value: 'fttx',               label: 'FTTX — Fibre Optique', icon: Zap,    desc: 'Raccordements fibre et abonnements haut débit' },
];

export default function DemandesCategories() {
  const navigate = useNavigate();
  const { stats, loading, error } = useDemandesStats();

  const totalDemandes  = Object.values(stats).reduce((a, s) => a + (s?.total || 0), 0);
  const totalEnAttente = Object.values(stats).reduce((a, s) => a + (s?.en_attente || 0), 0);

  return (
    <Layout>
      <div className="animate-page">

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="at-title" style={{ margin: 0 }}>Demandes de Service</h1>
            <p className="at-subtitle" style={{ margin: '2px 0 0' }}>Gérez les demandes clients par catégorie</p>
          </div>
          {!loading && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{totalDemandes}</p>
                <p style={{ margin: '1px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Total demandes</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{totalEnAttente}</p>
                <p style={{ margin: '1px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>En attente</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
            <div style={{ animation: 'spin 1s linear infinite' }}><Loader size={28} color="#2563eb" /></div>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>Chargement...</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', marginBottom: 16, fontSize: 13 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* ── Grille ── */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {SERVICE_CONFIG.map((service, idx) => {
              const Icon = service.icon;
              const stat = stats[service.value] || { total: 0, en_attente: 0 };

              return (
                <div
                  key={service.value}
                  onClick={() => navigate(`/crm/demandes/${service.value}`)}
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    animation: `fadeUp 0.35s ease ${idx * 0.06}s both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  {/* Header uniforme */}
                  <div style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, color: '#0f172a', fontSize: 14, fontWeight: 700 }}>{service.label}</h3>
                      <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: 11, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{service.desc}</p>
                    </div>
                  </div>

                  {/* Footer stats */}
                  <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{stat.total}</p>
                        <p style={{ margin: '1px 0 0', fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</p>
                      </div>
                      {stat.en_attente > 0 && (
                        <div>
                          <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#64748b' }}>{stat.en_attente}</p>
                          <p style={{ margin: '1px 0 0', fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>En attente</p>
                        </div>
                      )}
                    </div>
                    {stat.en_attente > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f1f5f9', borderRadius: 16, padding: '3px 8px' }}>
                        <Clock size={10} color="#64748b" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{stat.en_attente}</span>
                      </div>
                    )}
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={14} color="#475569" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>
    </Layout>
  );
}