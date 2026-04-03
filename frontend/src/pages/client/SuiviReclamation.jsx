import React, { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../../layouts/ClientLayout';
import { 
  MessageSquare, User, RefreshCw, Clock, 
  CheckCircle2, MapPin, AlertTriangle, ClipboardList 
} from 'lucide-react';
import { reclamationsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const STATUT_STEPS = [
  { key: 'ouvert',     label: 'Soumise',      icon: <Clock size={14} /> },
  { key: 'en_attente', label: 'En attente',    icon: <Clock size={14} /> },
  { key: 'en_cours',   label: 'En traitement', icon: <RefreshCw size={14} /> },
  { key: 'resolu',     label: 'Résolue',       icon: <CheckCircle2 size={14} /> },
];

const PRIO_CONFIG = {
  urgente: { bg: '#fee2e2', color: '#b91c1c', label: 'Urgente' },
  haute:   { bg: '#fef3c7', color: '#b45309', label: 'Haute'   },
  normale: { bg: '#dbeafe', color: '#1d4ed8', label: 'Normale' },
  basse:   { bg: '#d1fae5', color: '#065f46', label: 'Basse'   },
};

export default function SuiviReclamation() {
  const { client } = useAuth();
  const [reclamations, setReclamations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ── Scroll bloqué sur cette page uniquement ───────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);


  const fetchReclamations = useCallback(async () => {
    if (!client?.id) return;
    setLoading(true);
    try {
      const res = await reclamationsAPI.getAll({ client_id: client.id, limit: 50 });
      const data = res.data?.data || res.data || [];
      setReclamations(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selected) setSelected(data[0]);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [client?.id, selected]);

  useEffect(() => { fetchReclamations(); }, [fetchReclamations]);

  const getStepIndex = (statut) => {
    const map = { ouvert: 0, en_attente: 1, en_cours: 2, resolu: 3, ferme: 3 };
    return map[statut] ?? 0;
  };

  const filtered = reclamations.filter(r => {
    if (filter === 'open') return !['resolu', 'ferme'].includes(r.statut);
    if (filter === 'closed') return ['resolu', 'ferme'].includes(r.statut);
    return true;
  });

  const currentStep = selected ? getStepIndex(selected.statut) : 0;

  return (
    <ClientLayout>
      <div className="animate-page" style={{ padding: '16px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 2px', color: '#1e293b' }}>Suivi de mes demandes</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Tickets de {client?.prenom || 'mon compte'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="at-tab-btn" 
              onClick={fetchReclamations} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--at-border)', padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }}
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Actualiser
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '600', fontSize: '12px' }}>{client?.nom}</span>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--at-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="at-tabs-container" style={{ marginBottom: '14px' }}>
          {['all', 'open', 'closed'].map(f => (
            <button 
              key={f} 
              className={`at-tab-btn ${filter === f ? 'active' : ''}`} 
              onClick={() => setFilter(f)} 
              style={{ padding: '6px 16px', fontSize: '12px' }}
            >
              {f === 'all' ? 'Toutes' : f === 'open' ? 'En cours' : 'Résolues'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '14px', height: 'calc(100vh - 210px)' }}>
          
          {/* Sidebar Tickets */}
          <div className="at-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--at-border)', fontWeight: '700', fontSize: '12px' }}>
              Vos tickets ({filtered.length})
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Chargement...</div>
              ) : 
                filtered.map(rec => (
                  <div 
                    key={rec.id} 
                    onClick={() => setSelected(rec)} 
                    style={{ 
                      padding: '11px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
                      background: selected?.id === rec.id ? '#f0fdf4' : 'transparent',
                      borderLeft: selected?.id === rec.id ? '3px solid var(--at-green)' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontWeight: '600', fontSize: '11px', color: '#64748b' }}>#{rec.id?.slice(0, 5)}</span>
                      <span style={{ 
                        fontSize: '9px', padding: '2px 7px', borderRadius: '10px', 
                        background: PRIO_CONFIG[rec.priorite]?.bg || '#f1f5f9', 
                        color: PRIO_CONFIG[rec.priorite]?.color || '#64748b', fontWeight: '700' 
                      }}>
                        {PRIO_CONFIG[rec.priorite]?.label || 'Normale'}
                      </span>
                    </div>
                    <div style={{ fontWeight: '500', fontSize: '12px', color: '#1e293b' }}>{rec.titre}</div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Détails du Ticket */}
          <div className="at-card" style={{ padding: '20px', overflowY: 'auto' }}>
            {selected ? (
              <div>
                {/* Stepper */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
                  <div style={{ position: 'absolute', top: '16px', left: '0', height: '2px', background: 'var(--at-green)', zIndex: 0, width: `${(currentStep / 3) * 100}%`, transition: 'width 0.5s' }} />
                  {STATUT_STEPS.map((step, i) => (
                    <div key={step.key} style={{ zIndex: 1, textAlign: 'center', width: '70px' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 8px',
                        background: i <= currentStep ? 'var(--at-green)' : 'white',
                        color: i <= currentStep ? 'white' : '#94a3b8',
                        border: i <= currentStep ? 'none' : '2px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {i < currentStep ? <CheckCircle2 size={16} /> : step.icon}
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '600' }}>{step.label}</span>
                    </div>
                  ))}
                </div>

                <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px', color: '#1e293b' }}>{selected.titre}</h2>
                <div style={{ display: 'flex', gap: '16px', margin: '10px 0 14px', color: '#64748b', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12}/> {selected.adresse_probleme || 'Algérie'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={12}/> {selected.type_probleme}
                  </span>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  {selected.description || "Aucune description détaillée."}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                <ClipboardList size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                <p style={{ fontSize: '13px' }}>Sélectionnez un ticket pour afficher le suivi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}