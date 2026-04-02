import React, { useState, useEffect } from 'react';
import Bouton from '../common/Bouton';
import { Building2, User } from 'lucide-react';

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','MSila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
  'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane'
];

const EMPTY = {
  type: 'grand_public',
  nom: '', prenom: '', email: '', telephone: '',
  adresse: '', ville: '', wilaya: '', code_postal: '',
  date_naissance: '', statut_compte: 'actif',
  entreprise: '', siret: '', contact_principal: '', poste_contact: ''
};

export default function FormulaireClient({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Resync si on ouvre le formulaire avec un autre client (mode édition)
  useEffect(() => { setForm(initial || EMPTY); }, [initial]);

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: '#4A5568',
    marginBottom: 5, display: 'block',
    textTransform: 'uppercase', letterSpacing: 0.5
  };

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit && onSubmit(form); }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >

      {/* ── Sélecteur type ── */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { value: 'grand_public', label: 'Grand Public',          icon: <User size={15}/> },
          { value: 'corporate',   label: 'Corporate / Entreprise', icon: <Building2 size={15}/> }
        ].map(opt => (
          <button
            key={opt.value} type="button"
            onClick={() => set('type', opt.value)}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              border:      form.type === opt.value ? '2px solid #78BE20' : '2px solid #E2E8F0',
              background:  form.type === opt.value ? '#F0FFF4'           : 'white',
              color:       form.type === opt.value ? '#22863a'           : '#718096',
              transition: '0.15s'
            }}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* ── Champs Corporate ── */}
      {form.type === 'corporate' && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          padding: 16, background: '#F0F7FF', borderRadius: 10, border: '1px solid #BFDBFE'
        }}>
          {[
            { label: 'Nom entreprise *', key: 'entreprise',       placeholder: 'Ex: Sonatrach SPA', required: true },
            { label: 'N° RC / SIRET',    key: 'siret',            placeholder: 'RC N°...' },
            { label: 'Contact principal',key: 'contact_principal', placeholder: 'Nom du responsable' },
            { label: 'Poste',            key: 'poste_contact',    placeholder: 'DSI, Directeur...' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>{f.label}</label>
              <input
                className="at-input"
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                required={!!f.required}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Infos personnelles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[
          { label: 'Nom *',      key: 'nom',       placeholder: 'Nom',               required: true },
          { label: 'Prénom *',   key: 'prenom',    placeholder: 'Prénom',            required: true },
          { label: 'Email *',    key: 'email',      placeholder: 'email@exemple.com', required: true, type: 'email' },
          { label: 'Téléphone *',key: 'telephone', placeholder: '0x xx xx xx xx',   required: true },
        ].map(f => (
          <div key={f.key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              className="at-input"
              type={f.type || 'text'}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              required={!!f.required}
            />
          </div>
        ))}

        {form.type === 'grand_public' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Date de naissance</label>
            <input
              className="at-input" type="date"
              value={form.date_naissance}
              onChange={e => set('date_naissance', e.target.value)}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Statut compte</label>
          <select
            className="at-input"
            value={form.statut_compte}
            onChange={e => set('statut_compte', e.target.value)}
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* ── Adresse ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={labelStyle}>Adresse</label>
          <input
            className="at-input"
            value={form.adresse}
            onChange={e => set('adresse', e.target.value)}
            placeholder="Rue, N°..."
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Ville</label>
          <input className="at-input" value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="Ville" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Wilaya</label>
          <select className="at-input" value={form.wilaya} onChange={e => set('wilaya', e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Code postal</label>
          <input className="at-input" value={form.code_postal} onChange={e => set('code_postal', e.target.value)} placeholder="Ex: 16000" />
        </div>
      </div>

      <Bouton type="submit" disabled={loading} style={{ marginTop: 4 }}>
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </Bouton>
    </form>
  );
}