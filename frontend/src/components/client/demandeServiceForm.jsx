// src/components/client/DemandeServiceForm.jsx
import React from 'react';
import { Wifi, Phone, Router, Globe, Zap, ChevronRight } from 'lucide-react';

const SERVICES = [
  { value: 'ligne_telephonique', label: 'Ligne Téléphonique', icon: <Phone size={22}/>,  color: '#061a2e' },
  { value: 'adsl',               label: 'Internet ADSL',      icon: <Wifi size={22}/>,   color: '#061a2e' },
  { value: 'achat_modem',        label: 'Achat Modem',        icon: <Router size={22}/>, color: '#061a2e' },
  { value: 'ip_fixe',            label: '@IP Fixe',           icon: <Globe size={22}/>,  color: '#061a2e' },
  { value: 'fttx',               label: 'FTTX (Fibre)',       icon: <Zap size={22}/>,    color: '#061a2e' },
];

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','MSila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
  'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane'
];

// Champs supplémentaires selon le service
const EXTRA_FIELDS = {
  adsl: [
    { key: 'debit_souhaite', label: 'Débit souhaité', type: 'select', options: ['4 Mbps', '8 Mbps', '16 Mbps', '20 Mbps'] },
  ],
  fttx: [
    { key: 'debit_souhaite', label: 'Débit souhaité', type: 'select', options: ['50 Mbps', '100 Mbps', '200 Mbps', '1 Gbps'] },
  ],
  ip_fixe: [
    { key: 'nombre_ip',     label: "Nombre d'IPs souhaitées", type: 'select', options: ['/30 (2 IPs)', '/29 (6 IPs)', '/28 (14 IPs)'] },
    { key: 'justification', label: 'Justification technique', type: 'textarea' },
  ],
  achat_modem: [
    { key: 'type_modem', label: 'Type de modem', type: 'select', options: ['Modem ADSL simple', 'Modem ADSL Wi-Fi', 'Modem Fibre (ONT)', 'Routeur Wi-Fi'] },
  ],
  ligne_telephonique: [
    { key: 'type_ligne', label: 'Type de ligne', type: 'select', options: ['Résidentielle', 'Professionnelle'] },
  ],
};

export default function DemandeServiceForm({ form, onChange, onNext }) {
  const set = (k, v) => onChange({ ...form, [k]: v });
  const setDetail = (k, v) => onChange({ ...form, details: { ...form.details, [k]: v } });

  const canNext = form.type_service && form.adresse_installation && form.wilaya;

  return (
    <div>
      {/* ── Choix du service ── */}
      <div className="ds-form-section">
        <p className="ds-form-section-title">Choisissez votre service</p>
        <div className="ds-services-grid">
          {SERVICES.map(s => (
            <div
              key={s.value}
              className={`ds-service-card ${form.type_service === s.value ? 'selected' : ''}`}
              onClick={() => set('type_service', s.value)}
            >
              <div className="ds-service-icon" style={{ color: s.color }}>
                {s.icon}
              </div>
              <span className="ds-service-label">{s.label}</span>
              {form.type_service === s.value && (
                <span style={{ fontSize: 10, color: '#22863a', fontWeight: 700, background: '#f0fdf4', padding: '2px 8px', borderRadius: 10 }}>
                  ✓ Sélectionné
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Champs spécifiques au service ── */}
      {form.type_service && EXTRA_FIELDS[form.type_service]?.length > 0 && (
        <div className="ds-form-section">
          <p className="ds-form-section-title"> Options du service</p>
          <div className="ds-grid-2">
            {EXTRA_FIELDS[form.type_service].map(f => (
              <div key={f.key} className="ds-field" style={{ gridColumn: f.type === 'textarea' ? 'span 2' : undefined }}>
                <label className="ds-label">{f.label}</label>
                {f.type === 'select' ? (
                  <select className="ds-input" value={form.details?.[f.key] || ''} onChange={e => setDetail(f.key, e.target.value)}>
                    <option value="">-- Sélectionner --</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <textarea className="ds-input" rows={3} value={form.details?.[f.key] || ''} onChange={e => setDetail(f.key, e.target.value)} style={{ resize: 'vertical' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Adresse d'installation ── */}
      <div className="ds-form-section">
        <p className="ds-form-section-title"> Adresse d'installation</p>
        <div className="ds-field">
          <label className="ds-label">Adresse complète *</label>
          <input
            className="ds-input"
            placeholder="N°, Rue, Quartier..."
            value={form.adresse_installation || ''}
            onChange={e => set('adresse_installation', e.target.value)}
          />
        </div>
        <div className="ds-grid-2">
          <div className="ds-field">
            <label className="ds-label">Wilaya *</label>
            <select className="ds-input" value={form.wilaya || ''} onChange={e => set('wilaya', e.target.value)}>
              <option value="">-- Sélectionner --</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="ds-field">
            <label className="ds-label">Ville</label>
            <input className="ds-input" placeholder="Ville" value={form.ville || ''} onChange={e => set('ville', e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Bouton suivant ── */}
      <div className="ds-nav-btns">
        <button
          className="ds-btn-next"
          onClick={onNext}
          disabled={!canNext}
        >
          Étape suivante — Documents <ChevronRight size={17}/>
        </button>
      </div>

      {!canNext && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
          Sélectionnez un service et remplissez l'adresse pour continuer.
        </p>
      )}
    </div>
  );
}