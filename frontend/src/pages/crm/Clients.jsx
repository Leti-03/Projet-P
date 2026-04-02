import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/crm/common/Layout';
import ListeClients from '../../components/crm/clients/ListeClients';
import RechercheClientModal from '../../components/crm/clients/RechercheClientModal';
import Bouton from '../../components/crm/common/Bouton';
import { UserPlus, Search, ChevronLeft, ChevronRight, AlertTriangle, User, Wifi, Receipt } from 'lucide-react';

const API   = 'http://localhost:5000/api/clients';
const LIMIT = 15;

function ConfirmDelete({ isOpen, onClose, onConfirm, client }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 420, padding: 32, boxShadow: '0 25px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={26} color="#c53030" />
        </div>
        <h3 style={{ margin: '0 0 8px', color: '#1A1A1A' }}>Supprimer ce client ?</h3>
        <p style={{ color: '#718096', fontSize: 14, margin: '0 0 24px' }}>
          <strong>{client?.nom} {client?.prenom}</strong> sera définitivement supprimé.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onClose}   style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Annuler</button>
          <button onClick={onConfirm} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#c53030', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const navigate = useNavigate();

  const [clients,       setClients]       = useState([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(true);
  const [modalDelete,   setModalDelete]   = useState(null);
  const [toast,         setToast]         = useState(null);
  const [rechercheOpen, setRechercheOpen] = useState(false);
  const [rechercheTab,  setRechercheTab]  = useState('client');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshKey,    setRefreshKey]    = useState(0); // ← trigger re-fetch après delete

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch principal — dépendances directes, pas de useCallback ──────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ page, limit: LIMIT });
    if (search) params.append('search', search);

    axios.get(`${API}?${params}`)
      .then(res => {
        if (!cancelled) {
          setClients(res.data.data || []);
          setTotal(res.data.total || 0);
        }
      })
      .catch(() => { if (!cancelled) showToast('Erreur chargement clients', 'error'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page, search, refreshKey]); // ← tableau fixe et stable

  // Reset page quand search change
  const handleSearchChange = e => {
    setSearch(e.target.value);
    setPage(1); // ← dans le handler, pas dans un useEffect séparé
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/${modalDelete.id}`);
      setModalDelete(null);
      showToast('Client supprimé.');
      setRefreshKey(k => k + 1); // ← déclenche le useEffect
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  const openRecherche = tab => {
    setRechercheTab(tab);
    setSearchResults(null);
    setRechercheOpen(true);
  };

  const handleRecherche = async form => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (form.nom)            params.append('search', form.nom);
      if (form.prenom)         params.append('search', form.prenom);
      if (form.date_naissance) params.append('date_naissance', form.date_naissance);
      const res = await axios.get(`${API}?${params}&limit=20`);
      setSearchResults(res.data.data || []);
    } catch {
      showToast('Erreur de recherche', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectClient = client => {
    if (!client?.id) return;
    setRechercheOpen(false);
    navigate(`/crm/clients/${client.id}?tab=${rechercheTab}`);
  };

  const totalPages = Math.ceil(total / LIMIT);

  const quickBtnStyle = color => ({
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
    borderRadius: 12, border: `1.5px solid ${color}20`,
    background: `${color}08`, color,
    fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
  });

  return (
    <Layout>
      <div className="animate-page">

        {toast && (
          <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, padding: '14px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, background: toast.type === 'error' ? '#c53030' : '#22863a', color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s ease' }}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="at-title" style={{ margin: 0 }}>Base Clients</h1>
            <p className="at-subtitle" style={{ margin: '4px 0 0' }}>{total} clients enregistrés</p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button style={quickBtnStyle('#353a35')} onClick={() => openRecherche('client')}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#4CAF50'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563eb08'; e.currentTarget.style.borderColor = '#2563eb20'; }}>
              <User size={16} /> Client
            </button>
            <button style={quickBtnStyle('#353a35')} onClick={() => openRecherche('facturation')}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#4CAF50'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563eb08'; e.currentTarget.style.borderColor = '#2563eb20'; }}>
              <Receipt size={16} /> Facturation
            </button>
            <button style={quickBtnStyle('#353a35')} onClick={() => openRecherche('abonne')}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#4CAF50'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563eb08'; e.currentTarget.style.borderColor = '#2563eb20'; }}>
              <Wifi size={16} /> Abonnés
            </button>

            <Bouton icon={UserPlus} onClick={() => navigate('/crm/clients/new')}>
              Ajouter un client
            </Bouton>
          </div>
        </div>

        {/* Recherche */}
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 420 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input className="at-input" style={{ paddingLeft: 40 }}
            placeholder="Rechercher par nom, email, téléphone..."
            value={search}
            onChange={handleSearchChange} /> {/* ← handler unifié */}
        </div>

        <ListeClients
          clients={clients}
          loading={loading}
          onEdit={client => {
            if (!client?.id) return;
            navigate(`/crm/clients/${client.id}?edit=true`);
          }}
          onDelete={setModalDelete}
        />

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#4A5568' }}>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <ConfirmDelete
          isOpen={!!modalDelete}
          onClose={() => setModalDelete(null)}
          onConfirm={handleDelete}
          client={modalDelete}
        />

        <RechercheClientModal
          isOpen={rechercheOpen}
          onClose={client => {
            if (client?.id) handleSelectClient(client);
            else setRechercheOpen(false);
          }}
          onSearch={handleRecherche}
          results={searchResults}
          loading={searchLoading}
        />
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </Layout>
  );
}