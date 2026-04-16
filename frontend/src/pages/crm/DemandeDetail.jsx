// src/pages/crm/DemandeDetail.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Wifi, Phone, Router, Globe, Zap,
  User, MapPin, FileText, Image as ImageIcon, Calendar,
  Clock, CheckCircle, XCircle, RefreshCw, Loader, AlertCircle,
  Download, Eye, ChevronDown
} from 'lucide-react';
import Layout from '../../components/crm/common/Layout';
import { useDemandeById, updateDemandeStatut } from '../../hooks/crm/useDemandes';

const SERVICE_CONFIG = {
  ligne_telephonique: { label: 'Ligne Téléphonique', icon: Phone  },
  adsl:               { label: 'Internet ADSL',      icon: Wifi   },
  achat_modem:        { label: 'Achat Modem',        icon: Router },
  ip_fixe:            { label: '@IP Fixe',           icon: Globe  },
  fttx:               { label: 'FTTX — Fibre',       icon: Zap    },
};

const STATUT_STYLE = {
  en_attente: { bg: '#f1f5f9', color: '#475569', icon: Clock,       label: 'En attente' },
  en_cours:   { bg: '#f1f5f9', color: '#475569', icon: RefreshCw,   label: 'En cours' },
  approuvee:  { bg: '#f1f5f9', color: '#475569', icon: CheckCircle, label: 'Approuvée' },
  rejetee:    { bg: '#f1f5f9', color: '#475569', icon: XCircle,     label: 'Rejetée' },
  terminee:   { bg: '#f1f5f9', color: '#475569', icon: CheckCircle, label: 'Terminée' },
};

const STATUTS_LIST = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'en_cours',   label: 'En cours' },
  { value: 'approuvee',  label: 'Approuvée' },
  { value: 'rejetee',    label: 'Rejetée' },
  { value: 'terminee',   label: 'Terminée' },
];

const Field = ({ label, value }) => (
  <div>
    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <p style={{ margin: '3px 0 0', fontSize: 13, color: value ? '#0f172a' : '#cbd5e1', fontWeight: value ? 500 : 400 }}>{value || '—'}</p>
  </div>
);

function DocViewer({ label, url }) {
  const [enlarged, setEnlarged] = useState(false);
  if (!url) return null;
  const isPdf = url.toLowerCase().includes('.pdf');

  return (
    <>
      <div style={{ background: '#f8fafc', borderRadius: 10, border: '1.5px solid #e2e8f0', overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 6 }}>
          {isPdf ? <FileText size={12} color="#64748b" /> : <ImageIcon size={12} color="#64748b" />}
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', flex: 1 }}>{label}</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {!isPdf && (
              <button onClick={() => setEnlarged(true)}
                style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 10, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Eye size={10} /> Agrandir
              </button>
            )}
            <a href={url} target="_blank" rel="noreferrer"
              style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 10, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
              <Download size={10} /> Télécharger
            </a>
          </div>
        </div>
        <div style={{ padding: 8 }}>
          {isPdf ? (
            <a href={url} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: '#f8fafc', borderRadius: 8, textDecoration: 'none' }}>
              <FileText size={22} color="#64748b" />
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#475569' }}>Ouvrir le PDF</p>
                <p style={{ margin: '1px 0 0', fontSize: 10, color: '#94a3b8' }}>Nouvel onglet</p>
              </div>
            </a>
          ) : (
            <img src={url} alt={label} style={{ width: '100%', borderRadius: 6, objectFit: 'cover', maxHeight: 160, cursor: 'pointer' }} onClick={() => setEnlarged(true)} />
          )}
        </div>
      </div>

      {enlarged && (
        <div onClick={() => setEnlarged(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}>
          <img src={url} alt={label} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 10, objectFit: 'contain' }} />
          <button onClick={() => setEnlarged(false)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: 'white', width: 38, height: 38, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}

const Card = ({ icon: Icon, title, children }) => (
  <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16, marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={13} color="white" />
      </div>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{title}</h3>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px 24px' }}>
      {children}
    </div>
  </div>
);

export default function DemandeDetail() {
  const { type_service, id } = useParams();
  const navigate = useNavigate();
  const config = SERVICE_CONFIG[type_service] || SERVICE_CONFIG['adsl'];
  const Icon = config.icon;

  const { data: demande, loading, error } = useDemandeById(id);
  const [updatingStatut, setUpdatingStatut] = useState(false);
  const [statutDropdown, setStatutDropdown] = useState(false);
  const [currentStatut, setCurrentStatut]  = useState(null);
  const [toast, setToast] = useState(null);

  const statut = currentStatut || demande?.statut || 'en_attente';
  const sty = STATUT_STYLE[statut] || STATUT_STYLE['en_attente'];
  const StatusIcon = sty.icon;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatutChange = async (newStatut) => {
    setStatutDropdown(false);
    if (newStatut === statut) return;
    setUpdatingStatut(true);
    try {
      await updateDemandeStatut(id, newStatut);
      setCurrentStatut(newStatut);
      showToast(`Statut mis à jour : ${STATUT_STYLE[newStatut]?.label}`);
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    } finally { setUpdatingStatut(false); }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDetails = (details) => {
    if (!details || typeof details !== 'object') return [];
    return Object.entries(details).map(([k, v]) => ({ label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: v }));
  };

  return (
    <Layout>
      <div className="animate-page">

        {toast && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, padding: '12px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: toast.type === 'error' ? '#c53030' : '#22863a', color: 'white', boxShadow: '0 6px 20px rgba(0,0,0,0.18)' }}>
            {toast.msg}
          </div>
        )}

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/crm/demandes')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: '#64748b' }}>
            <ArrowLeft size={13} /> Demandes
          </button>
          <span style={{ color: '#cbd5e1' }}>›</span>
          <button onClick={() => navigate(`/crm/demandes/${type_service}`)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: '#64748b' }}>
            {config.label}
          </button>
          <span style={{ color: '#cbd5e1' }}>›</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>#{id?.slice(0, 8)}</span>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 10 }}>
            <div style={{ animation: 'spin 1s linear infinite' }}><Loader size={26} color="#475569" /></div>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>Chargement...</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: 13 }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {!loading && !error && demande && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

            {/* Colonne gauche */}
            <div>
              {/* Header card — uniforme */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 22px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="white" />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Demande de service</p>
                      <h2 style={{ margin: '2px 0 0', color: '#0f172a', fontSize: 18, fontWeight: 900 }}>{config.label}</h2>
                    </div>
                  </div>
                  {/* Statut dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setStatutDropdown(v => !v)} disabled={updatingStatut}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      {updatingStatut ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <StatusIcon size={11} />}
                      {sty.label} <ChevronDown size={11} />
                    </button>
                    {statutDropdown && (
                      <div style={{ position: 'absolute', top: '110%', right: 0, background: 'white', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.10)', padding: 5, zIndex: 100, minWidth: 140, border: '1px solid #e2e8f0' }}>
                        {STATUTS_LIST.map(s => (
                          <button key={s.value} onClick={() => handleStatutChange(s.value)}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '8px 10px', borderRadius: 7, border: 'none', background: statut === s.value ? '#f1f5f9' : 'transparent', color: '#475569', fontWeight: statut === s.value ? 800 : 600, fontSize: 12, cursor: 'pointer' }}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 11 }}>
                    <Calendar size={11} /> {formatDate(demande.created_at)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}>
                    <FileText size={11} /> #{demande.id?.slice(0, 12)}
                  </span>
                </div>
              </div>

              {/* Client */}
              {demande.client && (
                <Card icon={User} title="Client">
                  <Field label="Nom"       value={demande.client.nom} />
                  <Field label="Prénom"    value={demande.client.prenom} />
                  <Field label="Email"     value={demande.client.email} />
                  <Field label="Téléphone" value={demande.client.telephone} />
                  <Field label="Wilaya"    value={demande.client.wilaya} />
                </Card>
              )}

              {/* Adresse */}
              <Card icon={MapPin} title="Adresse d'installation">
                <Field label="Adresse" value={demande.adresse_installation} />
                <Field label="Wilaya"  value={demande.wilaya} />
                <Field label="Ville"   value={demande.ville} />
              </Card>

              {/* Options service */}
              {demande.details && Object.keys(demande.details).length > 0 && (
                <Card icon={Icon} title="Options du service">
                  {formatDetails(demande.details).map(({ label, value }) => (
                    <Field key={label} label={label} value={String(value)} />
                  ))}
                </Card>
              )}

              {/* Convention */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#f8fafc', borderRadius: 10, border: '1.5px solid #e2e8f0' }}>
                {demande.convention_acceptee ? <CheckCircle size={16} color="#475569" /> : <XCircle size={16} color="#94a3b8" />}
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#475569' }}>
                    {demande.convention_acceptee ? 'Convention acceptée' : 'Convention non acceptée'}
                  </p>
                  <p style={{ margin: '1px 0 0', fontSize: 11, color: '#94a3b8' }}>Conditions générales d'abonnement</p>
                </div>
              </div>
            </div>

            {/* Colonne droite — Documents */}
            <div style={{ position: 'sticky', top: 20 }}>
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={13} color="white" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Pièces justificatives</h3>
                </div>
                <DocViewer label="Justificatif de résidence" url={demande.doc_residence_url} />
                {demande.type_identite === 'carte_identite' ? (
                  <>
                    <DocViewer label="Carte d'identité — Recto" url={demande.doc_identite_recto_url} />
                    <DocViewer label="Carte d'identité — Verso" url={demande.doc_identite_verso_url} />
                  </>
                ) : (
                  <DocViewer label="Passeport" url={demande.doc_passeport_url} />
                )}
                {demande.doc_convention_url && <DocViewer label="Convention signée" url={demande.doc_convention_url} />}
                {!demande.doc_residence_url && !demande.doc_identite_recto_url && !demande.doc_passeport_url && (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>Aucun document joint</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </Layout>
  );
}