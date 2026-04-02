// src/pages/client/MesDemandes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, RefreshCw, Inbox } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ClientTopNav from '../../components/client/ClientTopNav';
import ClientSidebar from '../../components/client/ClientSidebar';
import CarteDemandeService from '../../components/client/carteDemandeService';
import ModalSuiviDemande from '../../components/client/modalSuivieDemande';

const API = 'http://localhost:5000';

const FILTRES_SERVICE = [
  { value: '',                  label: 'Tous les services' },
  { value: 'ligne_telephonique',label: 'Téléphonie'        },
  { value: 'adsl',              label: 'ADSL'              },
  { value: 'achat_modem',       label: 'Modem'             },
  { value: 'ip_fixe',           label: '@IP Fixe'          },
  { value: 'fttx',              label: 'Fibre FTTX'        },
];

const FILTRES_STATUT = [
  { value: '',           label: 'Tous les statuts'  },
  { value: 'en_attente', label: 'Soumise'           },
  { value: 'en_cours',   label: 'En traitement'     },
  { value: 'approuvee',  label: 'Approuvée'         },
  { value: 'terminee',   label: 'Terminée'          },
  { value: 'rejetee',    label: 'Rejetée'           },
];

export default function MesDemandes() {
  const navigate          = useNavigate();
  const { client }        = useAuth();
  const [demandes, setDemandes]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [filtreService, setFiltreService] = useState('');
  const [filtreStatut, setFiltreStatut]   = useState('');

  const fetchDemandes = async () => {
    if (!client?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ client_id: client.id, limit: 50 });
      const res  = await fetch(`${API}/api/demandes-service?${params}`);
      const json = await res.json();
      setDemandes(json.data || []);
    } catch (err) {
      console.error('Erreur chargement demandes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDemandes(); }, [client?.id]);

  // Filtrage local
  const demandesFiltrees = demandes.filter(d => {
    if (filtreService && d.type_service !== filtreService) return false;
    if (filtreStatut  && d.statut       !== filtreStatut)  return false;
    return true;
  });

  return (
    <div className="layout-wrapper">
      <ClientSidebar />

      <div className="main-content animate-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ClientTopNav title="Mes Demandes" />

        {/* ── Header + filtres ── */}
        {/* ── Header + filtres ── */}
        <div className="mds-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

            {/* Dropdown service */}
            <select
              value={filtreService}
              onChange={e => setFiltreService(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: 'white',
                fontSize: 13,
                fontWeight: 600,
                color: filtreService ? '#1A1A1A' : '#64748B',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                minWidth: 170,
              }}
            >
              {FILTRES_SERVICE.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {/* Dropdown statut */}
            <select
              value={filtreStatut}
              onChange={e => setFiltreStatut(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: 'white',
                fontSize: 13,
                fontWeight: 600,
                color: filtreStatut ? '#1A1A1A' : '#64748B',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                minWidth: 170,
              }}
            >
              {FILTRES_STATUT.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {/* Bouton reset si filtres actifs */}
            {(filtreService || filtreStatut) && (
              <button
                onClick={() => { setFiltreService(''); setFiltreStatut(''); }}
                style={{
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: '1px solid #FECACA',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>

  {/* Actions droite */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
    <button onClick={fetchDemandes} className="mds-btn-refresh" title="Actualiser">
      <RefreshCw size={15}/>
    </button>
    <button onClick={() => navigate('/client/demande-service')} className="mds-btn-new">
      <PlusCircle size={16}/> Nouvelle demande
    </button>
  </div>
</div>

        {/* ── Compteur ── */}
        <div style={{ padding: '0 0 16px 0', fontSize: 13, color: '#94a3b8', fontFamily: 'Poppins, sans-serif' }}>
          {demandesFiltrees.length} demande{demandesFiltrees.length !== 1 ? 's' : ''}
          {(filtreService || filtreStatut) && ' (filtrée' + (demandesFiltrees.length !== 1 ? 's' : '') + ')'}
        </div>

        {/* ── Liste demandes ── */}
        <div className="mds-list">
          {loading ? (
            <div className="mds-empty">
              <div className="suivi-spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Chargement...</p>
            </div>
          ) : demandesFiltrees.length === 0 ? (
            <div className="mds-empty">
              <Inbox size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 8px' }}>
                Aucune demande trouvée
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px' }}>
                {filtreService || filtreStatut ? 'Essayez de changer les filtres.' : 'Vous n\'avez pas encore soumis de demande.'}
              </p>
              <button onClick={() => navigate('/client/demande-service')} className="mds-btn-new">
                <PlusCircle size={16}/> Faire une demande
              </button>
            </div>
          ) : (
            demandesFiltrees.map(d => (
              <CarteDemandeService
                key={d.id}
                demande={d}
                onClick={setSelectedDemande}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modal suivi ── */}
      {selectedDemande && (
        <ModalSuiviDemande
          demande={selectedDemande}
          onClose={() => setSelectedDemande(null)}
        />
      )}
    </div>
  );
}