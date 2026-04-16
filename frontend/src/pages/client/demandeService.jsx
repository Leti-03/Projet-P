// src/pages/client/DemandeService.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ClipboardList, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ClientTopNav from '../../components/client/ClientTopNav';
import ClientSidebar from '../../components/client/ClientSidebar';
import DemandeServiceForm from '../../components/client/demandeServiceForm';
import DemandeDocuments from '../../components/client/demandeDocument';
import '../../App.css'; // ← le CSS qu'on a créé (à mettre dans src/)

const API = 'http://localhost:5000';

// ── Stepper visuel ────────────────────────────────────────────────────────────
const Stepper = ({ currentStep }) => {
  const steps = [
    { label: 'Choix du service', icon: <ClipboardList size={18}/> },
    { label: 'Documents',        icon: <FileText size={18}/> },
    { label: 'Confirmation',     icon: <CheckCircle size={18}/> },
  ];

  return (
    <div className="ds-stepper">
      {steps.map((s, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'active' : 'todo';
        return (
          <React.Fragment key={i}>
            <div className="ds-step">
              <div className={`ds-step-circle ${state}`}>
                {state === 'done' ? '✓' : i + 1}
              </div>
              <span className={`ds-step-label ${state}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`ds-step-line ${i < currentStep ? 'done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Upload helper ─────────────────────────────────────────────────────────────
const uploadFile = async (file) => {
  if (!file) return null;
  const fd = new FormData();
  fd.append('document', file);
  const res  = await fetch(`${API}/api/clients/upload-document`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur upload');
  return json.url;
};

// ── Page principale ───────────────────────────────────────────────────────────
export default function DemandeService() {
  const navigate      = useNavigate();
  const { client }    = useAuth();
  const [step, setStep] = useState(0); // 0=form, 1=docs, 2=succès

  // État formulaire étape 1
  const [form, setForm] = useState({
    type_service: '', adresse_installation: '', wilaya: '', ville: '', details: {}
  });

  // État documents étape 2
  const [docs, setDocs] = useState({
    type_identite:      'carte_identite',
    residence_file:     null, residence_preview:    '', residence_fileName:    '', residence_isCamera:    false,
    id_recto_file:      null, id_recto_preview:     '', id_recto_fileName:     '', id_recto_isCamera:     false,
    id_verso_file:      null, id_verso_preview:     '', id_verso_fileName:     '', id_verso_isCamera:     false,
    passeport_file:     null, passeport_preview:    '', passeport_fileName:    '', passeport_isCamera:    false,
  });

  // Convention
  const [convention, setConvention] = useState({
    accepted: false, justif_file: null, justif_preview: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // ── Gestion des documents ─────────────────────────────────────────────────
  const handleDocCapture = (key, file, url, directValue, isCamera = false) => {
    if (key === 'type_identite') {
      setDocs(d => ({
        ...d, type_identite: directValue,
        id_recto_file: null, id_recto_preview: '', id_recto_fileName: '', id_recto_isCamera: false,
        id_verso_file: null, id_verso_preview: '', id_verso_fileName: '', id_verso_isCamera: false,
        passeport_file: null, passeport_preview: '', passeport_fileName: '', passeport_isCamera: false,
      }));
    } else {
      setDocs(d => ({
        ...d,
        [`${key}_file`]:     file,
        [`${key}_preview`]:  url,
        [`${key}_fileName`]: file?.name || '',
        [`${key}_isCamera`]: isCamera,
      }));
    }
  };

  const handleDocRemove = (key) => {
    setDocs(d => ({
      ...d,
      [`${key}_file`]:     null,
      [`${key}_preview`]:  '',
      [`${key}_fileName`]: '',
      [`${key}_isCamera`]: false,
    }));
  };

  // ── Soumission finale ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Upload tous les fichiers en parallèle
      const [
        residenceUrl, rectoUrl, versoUrl, passeportUrl, convUrl
      ] = await Promise.all([
        uploadFile(docs.residence_file),
        uploadFile(docs.id_recto_file),
        uploadFile(docs.id_verso_file),
        uploadFile(docs.passeport_file),
        uploadFile(convention.justif_file),
      ]);

      // 2. Construire le payload
      const payload = {
        client_id:             client.id,
        type_service:          form.type_service,
        adresse_installation:  form.adresse_installation,
        wilaya:                form.wilaya,
        ville:                 form.ville,
        details:               form.details,
        doc_residence_url:     residenceUrl,
        type_identite:         docs.type_identite,
        doc_identite_recto_url: rectoUrl,
        doc_identite_verso_url: versoUrl,
        doc_passeport_url:     passeportUrl,
        convention_acceptee:   convention.accepted,
        doc_convention_url:    convUrl,
      };

      // 3. Envoyer au backend
      const res  = await fetch(`${API}/api/demandes-service`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de la soumission');

      setStep(2); // Succès !
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // ── Labels services ───────────────────────────────────────────────────────
  const SERVICE_LABELS = {
    ligne_telephonique: 'Ligne Téléphonique',
    adsl:               'Internet ADSL',
    achat_modem:        'Achat Modem',
    ip_fixe:            '@IP Fixe',
    fttx:               'FTTX (Fibre)',
  };

  return (
    <div className="layout-wrapper">
      <ClientSidebar />

      <div className="main-content animate-page" style={{ padding: '24px 40px' }}>
        <ClientTopNav title="Demande de service" />

        {/* ── Conteneur centré ── */}
        <div style={{ maxWidth: 700, width: '100%', margin: '0 auto' }}>

        {/* Stepper */}
        {step < 2 && <Stepper currentStep={step} />}

        {/* Erreur globale */}
        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#c53030', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Étape 0 : Formulaire ── */}
        {step === 0 && (
          <div className="at-card" style={{ padding: 28 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>
              Nouvelle demande
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#718096' }}>
              Choisissez votre service et renseignez l'adresse d'installation.
            </p>
            <DemandeServiceForm
              form={form}
              onChange={setForm}
              onNext={() => setStep(1)}
            />
          </div>
        )}

        {/* ── Étape 1 : Documents ── */}
        {step === 1 && (
          <div className="at-card" style={{ padding: 28 }}>
            {/* Récap service */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #a7f3d0', marginBottom: 24 }}>
              
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#065f46' }}>
                  {SERVICE_LABELS[form.type_service]}
                </div>
                <div style={{ fontSize: 12, color: '#059669' }}>
                   {form.adresse_installation}, {form.wilaya}
                </div>
              </div>
            </div>

            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>
              Pièces justificatives
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#718096' }}>
              Scannez ou importez vos documents pour valider votre demande.
            </p>

            <DemandeDocuments
              docs={docs}
              onDocCapture={handleDocCapture}
              onDocRemove={handleDocRemove}
              convention={convention}
              onConventionChange={setConvention}
              onBack={() => setStep(0)}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        )}

        {/* ── Étape 2 : Succès ── */}
        {step === 2 && (
          <div className="at-card ds-success" style={{ padding: 40 }}>
            <div className="ds-success-icon">✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#065f46', margin: '0 0 10px' }}>
              Demande soumise !
            </h2>
            <p style={{ color: '#718096', fontSize: 14, marginBottom: 6 }}>
              Votre demande de <strong>{SERVICE_LABELS[form.type_service]}</strong> a bien été enregistrée.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 30 }}>
              Vous recevrez une confirmation par email sous 48h ouvrables.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setStep(0); setForm({ type_service: '', adresse_installation: '', wilaya: '', ville: '', details: {} }); setDocs({ type_identite: 'carte_identite', residence_file: null, residence_preview: '', residence_fileName: '', residence_isCamera: false, id_recto_file: null, id_recto_preview: '', id_recto_fileName: '', id_recto_isCamera: false, id_verso_file: null, id_verso_preview: '', id_verso_fileName: '', id_verso_isCamera: false, passeport_file: null, passeport_preview: '', passeport_fileName: '', passeport_isCamera: false }); setConvention({ accepted: false, justif_file: null, justif_preview: '' }); }}
                style={{ padding: '11px 22px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'Poppins, sans-serif' }}
              >
                Nouvelle demande
              </button>
              <button
                onClick={() => navigate('/client/dashboard')}
                style={{ padding: '11px 22px', borderRadius: 10, border: 'none', background: 'var(--at-green)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Poppins, sans-serif' }}
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}