import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/crm/common/Layout';
import TabClient from '../../components/crm/clients/TabClient';
import TabCompte from '../../components/crm/clients/TabCompte';
import TabAbonne from '../../components/crm/clients/TabAbonne';
import TabFacturation from '../../components/crm/clients/TabFacturation';
import { ArrowLeft, User, CreditCard, Wifi, Receipt, Loader } from 'lucide-react';

const API = 'http://localhost:5000/api/clients';

const TABS = [
  { key: 'client',      label: 'Client',      icon: User      },
  { key: 'compte',      label: 'Compte',      icon: CreditCard },
  { key: 'abonne',      label: 'Abonné',      icon: Wifi      },
  { key: 'facturation', label: 'Facturation', icon: Receipt   },
];

const EMPTY_CLIENT = {
  titre: '', nom: '', prenom: '', nom_jeune_fille: '', sexe: '',
  date_naissance: '', lieu_naissance: '', nationalite: '', occupation: '',
  langue_client: '', categorie: 'grand_public', statut_compte: 'actif',
  qualite: '', blackliste: false, num_certificat: '', type_certificat: '',
  date_delivrance: '', code_client: '', compte_defaut: '',
  pays: 'Algérie', wilaya: '', daira: '', commune: '', ville: '',
  adresse: '', num_maison: '', bloc: '', code_postal: '', boite_postale: '',
  contact_principal: '', poste_contact: '', telephone: '', email: '',
  nom_entreprise: '', siret: '',
};

const inputStyle = {
  display: 'block', width: '100%', marginTop: 3, fontSize: 13,
  padding: '7px 10px', borderRadius: 8, boxSizing: 'border-box',
  border: '1.5px solid #e2e8f0', background: '#f8fafc',
  color: '#1e293b', outline: 'none', fontFamily: 'inherit',
};

const labelStyle = {
  fontSize: 11, fontWeight: 600, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

const FormSection = ({ title, children }) => (
  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 24, marginBottom: 16 }}>
    <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: '#1e293b', paddingBottom: 12, borderBottom: '1px solid #f8fafc' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px 28px' }}>
      {children}
    </div>
  </div>
);

const FormField = ({ label, name, type = 'text', options, value, onChange }) => (
  <div>
    <span style={labelStyle}>{label}</span>
    {options ? (
      <select name={name} value={value ?? ''} onChange={onChange} style={inputStyle}>
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value ?? ''} onChange={onChange} style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#2563eb'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
    )}
  </div>
);

const FormFieldShortcut = ({ label, name, type, options, form, onChange }) => (
  <FormField label={label} name={name} type={type} options={options} value={form[name]} onChange={onChange} />
);

function NouveauClientForm() {
  const navigate = useNavigate();
  const [form,   setForm]   = useState(EMPTY_CLIENT);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.email) {
      setError('Nom, prénom et email sont obligatoires.');
      return;
    }
    setSaving(true); setError(null);
    try {
      const payload = { ...form };
      ['date_naissance', 'date_delivrance'].forEach(key => {
        if (!payload[key]) payload[key] = null;
      });
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null;
      });
      const res = await axios.post(API, payload);
      navigate(`/crm/clients/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création.');
    } finally { setSaving(false); }
  };

  const fProps = { form, onChange: handleChange };

  return (
    <div style={{ padding: '20px 0' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <FormSection title="Informations générales">
        <FormFieldShortcut {...fProps} label="Titre"              name="titre"           options={['M.','Mme','Dr','Pr']} />
        <FormFieldShortcut {...fProps} label="Nom *"              name="nom" />
        <FormFieldShortcut {...fProps} label="Prénom *"           name="prenom" />
        <FormFieldShortcut {...fProps} label="Nom de jeune fille" name="nom_jeune_fille" />
        <FormFieldShortcut {...fProps} label="Sexe"               name="sexe"            options={['masculin','feminin']} />
        <FormFieldShortcut {...fProps} label="Date de naissance"  name="date_naissance"  type="date" />
        <FormFieldShortcut {...fProps} label="Lieu de naissance"  name="lieu_naissance" />
        <FormFieldShortcut {...fProps} label="Nationalité"        name="nationalite" />
        <FormFieldShortcut {...fProps} label="Occupation"         name="occupation" />
        <FormFieldShortcut {...fProps} label="Langue"             name="langue_client"   options={['Arabe','Français','Anglais','Tamazight']} />
        <FormFieldShortcut {...fProps} label="Catégorie"          name="categorie"       options={['grand_public','corporate']} />
        <FormFieldShortcut {...fProps} label="Statut"             name="statut_compte"   options={['actif','inactif','suspendu']} />
        <FormFieldShortcut {...fProps} label="Num. certificat"    name="num_certificat" />
        <FormFieldShortcut {...fProps} label="Type certificat"    name="type_certificat" options={['CIN','Passeport','Acte de naissance']} />
        <FormFieldShortcut {...fProps} label="Date délivrance"    name="date_delivrance" type="date" />
      </FormSection>

      <FormSection title="Adresse domicile">
        <FormFieldShortcut {...fProps} label="Pays"          name="pays" />
        <FormFieldShortcut {...fProps} label="Wilaya"        name="wilaya" />
        <FormFieldShortcut {...fProps} label="Daïra"         name="daira" />
        <FormFieldShortcut {...fProps} label="Commune"       name="commune" />
        <FormFieldShortcut {...fProps} label="Ville"         name="ville" />
        <FormFieldShortcut {...fProps} label="Adresse"       name="adresse" />
        <FormFieldShortcut {...fProps} label="Num. maison"   name="num_maison" />
        <FormFieldShortcut {...fProps} label="Bloc"          name="bloc" />
        <FormFieldShortcut {...fProps} label="Code postal"   name="code_postal" />
        <FormFieldShortcut {...fProps} label="Boîte postale" name="boite_postale" />
      </FormSection>

      <FormSection title="Contact">
        <FormFieldShortcut {...fProps} label="Téléphone"         name="telephone"         type="tel" />
        <FormFieldShortcut {...fProps} label="Email *"           name="email"             type="email" />
        <FormFieldShortcut {...fProps} label="Contact principal" name="contact_principal" />
        <FormFieldShortcut {...fProps} label="Poste"             name="poste_contact" />
      </FormSection>

      {form.categorie === 'corporate' && (
        <FormSection title="Informations entreprise">
          <FormFieldShortcut {...fProps} label="Nom entreprise" name="nom_entreprise" />
          <FormFieldShortcut {...fProps} label="SIRET / RC"     name="siret" />
        </FormSection>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
        <button onClick={() => navigate('/crm/clients')}
          style={{ padding: '10px 24px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#64748b' }}>
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={saving}
          style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: saving ? '#93c5fd' : '#4CAF50', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          {saving
            ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Création...</>
            : 'Créer le client'}
        </button>
      </div>
    </div>
  );
}

// ── Page ClientDetail ─────────────────────────────────────────────────────────
export default function ClientDetail() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  const isNew    = id === 'new';
  const editMode = searchParams.get('edit') === 'true';
  const initTab  = searchParams.get('tab') || 'client';

  const [activeTab, setActiveTab] = useState(initTab);
  const [client,    setClient]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (!id || id === 'new' || id === 'undefined') return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    axios.get(`${API}/${id}/detail`)
      .then(res  => { if (!cancelled) setClient(res.data); })
      .catch(()  => { if (!cancelled) setError('Erreur lors du chargement du client.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  // Badges statut + catégorie pour le breadcrumb
  const info = client?.info;
  const statusColor = info?.statut_compte === 'actif'
    ? { bg: '#f0fdf4', color: '#16a34a', label: 'Actif' }
    : { bg: '#fef2f2', color: '#dc2626', label: 'Inactif' };

  return (
    <Layout>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div className="animate-page">

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
            <Loader size={36} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: 15 }}>Chargement du client...</p>
          </div>
        )}

        {/* ── Erreur ── */}
        {!loading && error && (
          <div style={{ padding: 40, textAlign: 'center', color: '#dc2626' }}>
            <p>{error}</p>
            <button onClick={() => navigate('/crm/clients')}
              style={{ marginTop: 16, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
              ← Retour
            </button>
          </div>
        )}

        {/* ── Contenu ── */}
        {!loading && !error && (
          <>
            {/* Breadcrumb avec nom + badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/crm/clients')} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white',
                cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#475569', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#4CAF50'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}>
                <ArrowLeft size={16} /> Base Clients
              </button>

              <span style={{ color: '#cbd5e1' }}>›</span>

              {/* Nom */}
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                {isNew ? 'Nouveau client' : info ? `${info.nom ?? ''} ${info.prenom ?? ''}`.trim() : '...'}
              </span>

              {/* Badges — uniquement si client chargé */}
              {!isNew && info && (
                <>
                  <span style={{ background: '#f1f5f9', color: '#334155', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                    {info.categorie === 'corporate' ? 'Corporate' : 'Grand Public'}
                  </span>
                  <span style={{ background: statusColor.bg, color: statusColor.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                    {statusColor.label}
                  </span>
                  {info.code_client && (
                    <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, fontFamily: 'monospace' }}>
                      {info.code_client}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* ── Mode création ── */}
            {isNew && <NouveauClientForm />}

            {/* ── Mode consultation / édition ── */}
            {!isNew && client && (
              <>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 16, padding: 6, border: '1px solid #f1f5f9', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  {TABS.map(tab => {
                    const Icon     = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: isActive ? 'linear-gradient(135deg, #4CAF50, #d5e6d5)' : 'transparent',
                        color: isActive ? 'white' : '#4b4949',
                        fontWeight: isActive ? 700 : 500, fontSize: 14, transition: 'all 0.25s',
                        boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
                      }}>
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Contenu tab */}
                {activeTab === 'client' && (
                  <TabClient
                    client={client.info}
                    autoEdit={editMode}
                    onUpdated={updated => setClient(prev => ({ ...prev, info: updated }))}
                  />
                )}
                {activeTab === 'compte'      && <TabCompte      comptes={client.comptes} />}
                {activeTab === 'abonne'      && <TabAbonne      abonnes={client.abonnes} />}
                {activeTab === 'facturation' && <TabFacturation facturation={client.facturation} />}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}