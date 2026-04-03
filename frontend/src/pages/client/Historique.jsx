import React, { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../../layouts/ClientLayout';
import CarteRecap from '../../components/crm/dashboard/CarteRecap';
import {
  Search, ClipboardList, CheckCircle2, Clock,
  RefreshCw, User, MoreVertical, Wifi, Phone,
  Router as RouterIcon, Globe, Zap, FileText
} from 'lucide-react';
import { reclamationsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const API = 'http://localhost:5000';

// ── Styles statuts réclamations ───────────────────────────────────────────────
const STATUT_REC = {
  ouvert:    { color: '#EF4444', bg: '#FEF2F2', label: 'Ouverte'   },
  en_cours:  { color: '#3B82F6', bg: '#EFF6FF', label: 'En cours'  },
  resolu:    { color: '#22C55E', bg: '#F0FDF4', label: 'Résolue'   },
  ferme:     { color: '#6B7280', bg: '#F9FAFB', label: 'Fermée'    },
};

// ── Styles statuts demandes ───────────────────────────────────────────────────
const STATUT_DEM = {
  en_attente: { color: '#E65100', bg: '#FFF3E0', label: 'Soumise'       },
  en_cours:   { color: '#1565C0', bg: '#E3F2FD', label: 'En traitement' },
  approuvee:  { color: '#2E7D32', bg: '#E8F5E9', label: 'Approuvée'     },
  terminee:   { color: '#065f46', bg: '#d1fae5', label: 'Terminée'      },
  rejetee:    { color: '#9B1C1C', bg: '#FEE2E2', label: 'Rejetée'       },
};

// ── Icônes services ───────────────────────────────────────────────────────────
const SERVICE_ICONS = {
  ligne_telephonique: <Phone size={14} />,
  adsl:               <Wifi size={14} />,
  achat_modem:        <RouterIcon size={14} />,
  ip_fixe:            <Globe size={14} />,
  fttx:               <Zap size={14} />,
};

const SERVICE_LABELS = {
  ligne_telephonique: 'Ligne Téléphonique',
  adsl:               'Internet ADSL',
  achat_modem:        'Achat Modem',
  ip_fixe:            '@IP Fixe',
  fttx:               'FTTX (Fibre)',
};

// ── Badge statut réutilisable ─────────────────────────────────────────────────
const Badge = ({ cfg }) => (
  <span style={{
    fontSize: '10px', fontWeight: '700',
    padding: '3px 10px', borderRadius: '20px',
    background: cfg.bg, color: cfg.color,
    whiteSpace: 'nowrap',
  }}>
    {cfg.label}
  </span>
);

export default function Historique() {
  const { client } = useAuth();

  // ── Onglet actif ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('reclamations');

  // ── Réclamations ──────────────────────────────────────────────────────────
  const [reclamations, setReclamations] = useState([]);
  const [loadingRec, setLoadingRec]     = useState(true);

  const loadReclamations = useCallback(async () => {
    if (!client?.id) return;
    setLoadingRec(true);
    try {
      const res = await reclamationsAPI.getAll({ client_id: client.id });
      setReclamations(res.data?.data || res.data || []);
    } catch (e) {
      console.error('Erreur réclamations:', e);
    } finally {
      setLoadingRec(false);
    }
  }, [client?.id]);

  // ── Demandes de service ───────────────────────────────────────────────────
  const [demandes, setDemandes]     = useState([]);
  const [loadingDem, setLoadingDem] = useState(true);

  const loadDemandes = useCallback(async () => {
    if (!client?.id) return;
    setLoadingDem(true);
    try {
      const params = new URLSearchParams({ client_id: client.id, limit: 100 });
      const res  = await fetch(`${API}/api/demandes-service?${params}`);
      const json = await res.json();
      setDemandes(json.data || []);
    } catch (e) {
      console.error('Erreur demandes:', e);
    } finally {
      setLoadingDem(false);
    }
  }, [client?.id]);

  useEffect(() => {
    loadReclamations();
    loadDemandes();
  }, [loadReclamations, loadDemandes]);

  const handleRefresh = () => {
    loadReclamations();
    loadDemandes();
  };

  // ── Recherche + filtre ────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const filteredRec = reclamations.filter(item =>
    (item.titre?.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || item.statut === filter)
  );

  const filteredDem = demandes.filter(item =>
    (
      SERVICE_LABELS[item.type_service]?.toLowerCase().includes(search.toLowerCase()) ||
      item.wilaya?.toLowerCase().includes(search.toLowerCase()) ||
      item.adresse_installation?.toLowerCase().includes(search.toLowerCase())
    ) &&
    (!filter || item.statut === filter)
  );

  const loading = loadingRec || loadingDem;

  // ── Stats globales ────────────────────────────────────────────────────────
  const resolues = reclamations.filter(r => r.statut === 'resolu').length;
  const enCours  = [
    ...reclamations.filter(r => r.statut === 'en_cours'),
    ...demandes.filter(d => d.statut === 'en_cours'),
  ].length;

  return (
    <ClientLayout>
      <div className="animate-page" style={{ padding: '16px' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 2px', color: '#1e293b' }}>
              Historique Complet
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Réclamations et demandes de service
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleRefresh}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--at-border)', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', borderRadius: '8px' }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontWeight: '600', fontSize: '12px' }}>
                {client?.nom} {client?.prenom}
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--at-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="at-grid" style={{ marginBottom: '16px' }}>
          <CarteRecap titre="Réclamations" valeur={reclamations.length} icone={ClipboardList} couleur="var(--at-green)" />
          <CarteRecap titre="Demandes"     valeur={demandes.length}     icone={FileText}      couleur="#3182ce"          />
          <CarteRecap titre="Résolues"     valeur={resolues}            icone={CheckCircle2}  couleur="#22c55e"          />
          <CarteRecap titre="En cours"     valeur={enCours}             icone={Clock}         couleur="var(--at-orange)" />
        </div>

        {/* ── Onglets ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[
            { key: 'reclamations', label: `Réclamations (${reclamations.length})` },
            { key: 'demandes',     label: `Demandes de service (${demandes.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setFilter(''); setSearch(''); }}
              style={{
                padding: '7px 16px', borderRadius: '8px',
                border: activeTab === tab.key ? 'none' : '1px solid #e2e8f0',
                background: activeTab === tab.key ? 'var(--at-green)' : 'white',
                color: activeTab === tab.key ? 'white' : '#64748b',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Barre recherche + filtre ────────────────────────────────────── */}
        <div className="at-card" style={{ marginBottom: '14px', padding: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
              <input
                className="at-input"
                placeholder={activeTab === 'reclamations' ? 'Rechercher une réclamation...' : 'Rechercher une demande...'}
                style={{ width: '100%', paddingLeft: '34px', fontSize: '12px', height: '34px' }}
                value={search}
                onChange={e => { setSearch(e.target.value); setFilter(''); }}
              />
            </div>

            {activeTab === 'reclamations' ? (
              <select className="at-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ minWidth: '160px', fontSize: '12px', height: '34px' }}>
                <option value="">Tous les statuts</option>
                <option value="ouvert">Ouverte</option>
                <option value="en_cours">En cours</option>
                <option value="resolu">Résolue</option>
                <option value="ferme">Fermée</option>
              </select>
            ) : (
              <select className="at-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ minWidth: '160px', fontSize: '12px', height: '34px' }}>
                <option value="">Tous les statuts</option>
                <option value="en_attente">Soumise</option>
                <option value="en_cours">En traitement</option>
                <option value="approuvee">Approuvée</option>
                <option value="terminee">Terminée</option>
                <option value="rejetee">Rejetée</option>
              </select>
            )}
          </div>
        </div>

        {/* ── Liste ───────────────────────────────────────────────────────── */}
        <div className="at-card" style={{ padding: '0', overflow: 'hidden' }}>

          {/* Onglet Réclamations */}
          {activeTab === 'reclamations' && (
            loadingRec ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Chargement...</div>
            ) : filteredRec.length > 0 ? (
              filteredRec.map((item, idx) => {
                const s = STATUT_REC[item.statut] || STATUT_REC.ouvert;
                return (
                  <div key={idx} className="at-table-row" style={{ display: 'flex', alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>{item.titre}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {item.type_probleme} • {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ marginRight: '20px' }}><Badge cfg={s} /></div>
                    <button style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                      <MoreVertical size={15} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Aucune réclamation trouvée.</div>
            )
          )}

          {/* Onglet Demandes de service */}
          {activeTab === 'demandes' && (
            loadingDem ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Chargement...</div>
            ) : filteredDem.length > 0 ? (
              filteredDem.map((item, idx) => {
                const s = STATUT_DEM[item.statut] || STATUT_DEM.en_attente;
                return (
                  <div key={idx} className="at-table-row" style={{ display: 'flex', alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid #f1f5f9' }}>

                    {/* Icône service */}
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: '#f1f5f9', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#475569',
                      marginRight: '12px', flexShrink: 0,
                    }}>
                      {SERVICE_ICONS[item.type_service] || <FileText size={14} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                        {SERVICE_LABELS[item.type_service] || item.type_service}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {item.wilaya}{item.ville ? ` — ${item.ville}` : ''} • {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div style={{ marginRight: '20px' }}><Badge cfg={s} /></div>
                    <button style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                      <MoreVertical size={15} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Aucune demande de service trouvée.</div>
            )
          )}

        </div>
      </div>
    </ClientLayout>
  );
}