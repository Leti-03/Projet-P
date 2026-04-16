import React, { useState } from 'react';
import { User, MapPin, FileText, Shield, Pencil, X, Check, Loader } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/clients';

// ── Champ affichage ───────────────────────────────────────────────────────────
const FieldView = ({ label, value }) => (
  <div style={{ marginBottom: 2 }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </span>
    <p style={{ margin: '3px 0 0', fontSize: 14, color: value ? '#1e293b' : '#cbd5e1', fontWeight: value ? 500 : 400 }}>
      {value || '—'}
    </p>
  </div>
);

// ── Champ édition ─────────────────────────────────────────────────────────────
const FieldEdit = ({ label, name, value, onChange, type = 'text', options }) => (
  <div style={{ marginBottom: 2 }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </span>
    {options ? (
      <select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        style={{ display: 'block', width: '100%', marginTop: 3, fontSize: 14, padding: '6px 10px', borderRadius: 8, boxSizing: 'border-box', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#1e293b', outline: 'none' }}
      >
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        style={{ display: 'block', width: '100%', marginTop: 3, fontSize: 14, padding: '6px 10px', borderRadius: 8, boxSizing: 'border-box', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = '#2563eb'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
    )}
  </div>
);

// ── Champ hybride (view/edit) ─────────────────────────────────────────────────
const F = ({ label, name, type, options, editing, form, client, onChange }) => {
  if (editing) {
    return (
      <FieldEdit
        label={label}
        name={name}
        value={form[name]}
        onChange={onChange}
        type={type}
        options={options}
      />
    );
  }
  const val = name === 'blackliste'
    ? (client[name] ? 'Oui' : 'Non')
    : client[name];
  return <FieldView label={label} value={val} />;
};

// ── Section ───────────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 24, marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #f8fafc' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6a6a6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color="white" />
      </div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{title}</h3>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
      {children}
    </div>
  </div>
);

// ── Composant principal ───────────────────────────────────────────────────────
export default function TabClient({ client, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  if (!client) return null;

  const statusColor = client.statut_compte === 'actif'
    ? { bg: '#f0fdf4', color: '#16a34a', label: 'Actif' }
    : { bg: '#fef2f2', color: '#dc2626', label: 'Inactif' };

  const startEdit  = () => { setForm({ ...client }); setError(null); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setForm({}); setError(null); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const res = await axios.put(`${API}/${client.id}`, form);
      onUpdated?.(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally { setSaving(false); }
  };

  const fProps = { editing, form, client, onChange: handleChange };

  return (
    <div style={{ padding: '20px 0' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header identité
      <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={28} color='#1e293b' />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: 22, fontWeight: 800 }}>
            {editing ? `${form.nom ?? ''} ${form.prenom ?? ''}` : `${client.nom ?? ''} ${client.prenom ?? ''}`.trim() || 'Nouveau client'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <span style={{ background: '#f1f5f9', color: '#334155', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
              {client.categorie === 'corporate' ? 'Corporate' : 'Grand Public'}
            </span>
            <span style={{ background: statusColor.bg, color: statusColor.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
              {statusColor.label}
            </span>
          </div>
        </div>
        {client.code_client && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>Code client</p>
            <p style={{ margin: '4px 0 0', color: '#1e293b', fontWeight: 700, fontSize: 15, fontFamily: 'monospace' }}>
              {client.code_client}
            </p>
          </div>
        )}
      </div> */}

      {/* Barre actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {error && <span style={{ fontSize: 13, color: '#dc2626', marginRight: 'auto' }}>{error}</span>}
        {!editing ? (
          <button onClick={startEdit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#2563eb' }}>
            <Pencil size={14} /> Modifier
          </button>
        ) : (
          <>
            <button onClick={cancelEdit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#64748b' }}>
              <X size={14} /> Annuler
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: 'none', background: saving ? '#93c5fd' : '#2563eb', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, color: 'white' }}>
              {saving ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        )}
      </div>

      {/* Section 1 — Informations générales */}
      <Section icon={User} title="Informations générales">
        <F {...fProps} label="Titre"              name="titre"           options={['M.','Mme','Dr','Pr']} />
        <F {...fProps} label="Nom"                name="nom" />
        <F {...fProps} label="Prénom"             name="prenom" />
        <F {...fProps} label="Nom de jeune fille" name="nom_jeune_fille" />
        <F {...fProps} label="Sexe"               name="sexe"            options={['masculin','feminin']} />
        <F {...fProps} label="Date de naissance"  name="date_naissance"  type="date" />
        <F {...fProps} label="Lieu de naissance"  name="lieu_naissance" />
        <F {...fProps} label="Nationalité"        name="nationalite" />
        <F {...fProps} label="Occupation"         name="occupation" />
        <F {...fProps} label="Langue client"      name="langue_client"   options={['Arabe','Français','Anglais','Tamazight']} />
        <F {...fProps} label="Catégorie"          name="categorie"       options={['grand_public','corporate']} />
        <F {...fProps} label="Statut du compte"   name="statut_compte"   options={['actif','inactif','suspendu']} />
        <F {...fProps} label="Qualité"            name="qualite" />
        <F {...fProps} label="Blacklisté"         name="blackliste" />
        <F {...fProps} label="Num. certificat"    name="num_certificat" />
        <F {...fProps} label="Type de certificat" name="type_certificat" options={['CIN','Passeport','Acte de naissance']} />
        <F {...fProps} label="Date de délivrance" name="date_delivrance" type="date" />
        <F {...fProps} label="Code client"        name="code_client" />
        <F {...fProps} label="Compte par défaut"  name="compte_defaut" />
      </Section>

      {/* Section 2 — Adresse */}
      <Section icon={MapPin} title="Adresse domicile">
        <F {...fProps} label="Pays"          name="pays" />
        <F {...fProps} label="Wilaya"        name="wilaya" />
        <F {...fProps} label="Daïra"         name="daira" />
        <F {...fProps} label="Commune"       name="commune" />
        <F {...fProps} label="Ville"         name="ville" />
        <F {...fProps} label="Adresse"       name="adresse" />
        <F {...fProps} label="Num. maison"   name="num_maison" />
        <F {...fProps} label="Bloc"          name="bloc" />
        <F {...fProps} label="Code postal"   name="code_postal" />
        <F {...fProps} label="Boîte postale" name="boite_postale" />
      </Section>

      {/* Section 3 — Contact */}
      <Section icon={FileText} title="Contact / Mandataire">
        <F {...fProps} label="Contact principal" name="contact_principal" />
        <F {...fProps} label="Poste"             name="poste_contact" />
        <F {...fProps} label="Téléphone"         name="telephone"  type="tel" />
        <F {...fProps} label="Email"             name="email"      type="email" />
      </Section>

      {/* Section 4 — Entreprise (corporate) */}
      {(client.categorie === 'corporate' || form.categorie === 'corporate') && (
        <Section icon={Shield} title="Informations entreprise">
          <F {...fProps} label="Nom entreprise"    name="nom_entreprise" />
          <F {...fProps} label="SIRET / RC"        name="siret" />
          <F {...fProps} label="Contact principal" name="contact_principal" />
          <F {...fProps} label="Poste du contact"  name="poste_contact" />
        </Section>
      )}
    </div>
  );
}