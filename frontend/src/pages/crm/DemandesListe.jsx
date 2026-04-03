// src/pages/crm/DemandesListe.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wifi, Phone, Router, Globe, Zap, Search, ChevronRight, ChevronLeft, Loader, AlertCircle, Calendar, MapPin, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Layout from '../../components/crm/common/Layout';
import { useDemandes } from '../../hooks/crm/useDemandes';

const SERVICE_CONFIG = {
  ligne_telephonique: { label: 'Ligne Téléphonique', icon: Phone  },
  adsl:               { label: 'Internet ADSL',      icon: Wifi   },
  achat_modem:        { label: 'Achat Modem',        icon: Router },
  ip_fixe:            { label: '@IP Fixe',           icon: Globe  },
  fttx:               { label: 'FTTX — Fibre Optique', icon: Zap  },
};

const STATUTS = [
  { value: '',           label: 'Tous les statuts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'en_cours',   label: 'En cours' },
  { value: 'approuvee',  label: 'Approuvée' },
  { value: 'rejetee',    label: 'Rejetée' },
  { value: 'terminee',   label: 'Terminée' },
];

const STATUT_STYLE = {
  en_attente: { bg: '#f1f5f9', color: '#475569', icon: Clock,       label: 'En attente' },
  en_cours:   { bg: '#f1f5f9', color: '#475569', icon: RefreshCw,   label: 'En cours' },
  approuvee:  { bg: '#f1f5f9', color: '#475569', icon: CheckCircle, label: 'Approuvée' },
  rejetee:    { bg: '#f1f5f9', color: '#475569', icon: XCircle,     label: 'Rejetée' },
  terminee:   { bg: '#f1f5f9', color: '#475569', icon: CheckCircle, label: 'Terminée' },
};

const LIMIT = 15;

export default function DemandesListe() {
  const { type_service } = useParams();
  const navigate = useNavigate();
  const config = SERVICE_CONFIG[type_service] || SERVICE_CONFIG['adsl'];
  const Icon = config.icon;

  const [statut, setStatut] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const { data: demandes, total, loading, error, refetch } = useDemandes({ type_service, statut: statut || undefined, page, limit: LIMIT });

  const filtered = search
    ? demandes.filter(d =>
        [d.client?.nom, d.client?.prenom, d.adresse_installation, d.wilaya]
          .filter(Boolean).some(v => v.toLowerCase().includes(search.toLowerCase()))
      )
    : demandes;

  const totalPages = Math.ceil(total / LIMIT);

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Layout>
      <div className="animate-page">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button onClick={() => navigate('/crm/demandes')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: '#64748b' }}>
            <ArrowLeft size={13} /> Demandes
          </button>
          <span style={{ color: '#cbd5e1' }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{config.label}</span>
        </div>

        {/* Header banner — uniforme */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 22px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#0f172a', fontSize: 17, fontWeight: 900 }}>{config.label}</h1>
              <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: 12 }}>
                {loading ? '...' : `${total} demande(s) enregistrée(s)`}
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, prénom, adresse..."
              style={{ width: '100%', paddingLeft: 32, padding: '8px 12px 8px 32px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: 'white' }} />
          </div>
          <select value={statut} onChange={e => { setStatut(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, background: 'white', outline: 'none', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
            {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 0', gap: 10 }}>
            <div style={{ animation: 'spin 1s linear infinite' }}><Loader size={24} color="#475569" /></div>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>Chargement...</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', marginBottom: 14, fontSize: 13 }}>
            <AlertCircle size={15} /> {error}
            <button onClick={refetch} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 7, border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>
                <Icon size={36} style={{ opacity: 0.2, marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 600 }}>Aucune demande trouvée</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((demande, idx) => {
                  const sty = STATUT_STYLE[demande.statut] || STATUT_STYLE['en_attente'];
                  const StatusIcon = sty.icon;
                  return (
                    <div key={demande.id}
                      onClick={() => navigate(`/crm/demandes/${type_service}/${demande.id}`)}
                      style={{
                        background: 'white', borderRadius: 12, border: '1.5px solid #e2e8f0',
                        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', transition: 'all 0.18s',
                        animation: `fadeUp 0.25s ease ${idx * 0.03}s both`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}
                    >
                      {/* Avatar */}
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>
                          {demande.client?.nom?.[0] || demande.client_id?.toString()[0] || '?'}
                        </span>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#0f172a' }}>
                            {demande.client ? `${demande.client.nom || ''} ${demande.client.prenom || ''}`.trim() : `Client #${demande.client_id}`}
                          </p>
                          <span style={{ fontSize: 10, fontWeight: 600, background: '#f8fafc', color: '#94a3b8', padding: '1px 7px', borderRadius: 6, fontFamily: 'monospace' }}>
                            #{demande.id?.toString().slice(0, 8)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 3, flexWrap: 'wrap' }}>
                          {demande.adresse_installation && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748b' }}>
                              <MapPin size={10} /> {demande.adresse_installation}
                            </span>
                          )}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#94a3b8' }}>
                            <Calendar size={10} /> {formatDate(demande.created_at)}
                          </span>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: sty.bg, color: sty.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 16 }}>
                          <StatusIcon size={10} /> {sty.label}
                        </span>
                        <ChevronRight size={14} color="#cbd5e1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
                  <ChevronLeft size={14} />
                </button>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Page {page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>
    </Layout>
  );
}