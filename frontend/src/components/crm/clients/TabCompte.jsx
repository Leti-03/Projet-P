import React from 'react';
import { CreditCard, MapPin, Banknote } from 'lucide-react';

const Field = ({ label, value }) => (
  <div>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <p style={{ margin: '3px 0 0', fontSize: 14, color: value ? '#1e293b' : '#cbd5e1', fontWeight: value ? 500 : 400 }}>
      {value || '—'}
    </p>
  </div>
);

const Section = ({ icon: Icon, title, children, color }) => (
  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 24, marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #f8fafc' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: color || 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color="white" />
      </div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{title}</h3>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
      {children}
    </div>
  </div>
);

export default function TabCompte({ comptes }) {
  if (!comptes || comptes.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
        <CreditCard size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
        <p>Aucun compte associé à ce client.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Accounts list summary */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, marginBottom: 16 }}>
        <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {comptes.length} compte(s)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {comptes.map((compte, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0'
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: compte.etat === 'Actif' ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1e293b', fontFamily: 'monospace' }}>{compte.code_du_compte}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{compte.type_de_compte} · {compte.flag_paiement}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: compte.flag_paiement === 'Postpayé' ? '#eff6ff' : '#f0fdf4', color: compte.flag_paiement === 'Postpayé' ? '#2563eb' : '#16a34a' }}>
                  {compte.flag_paiement}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a' }}>
                  {compte.etat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail for each account */}
      {comptes.map((compte, i) => (
        <div key={i}>
          <div style={{ marginBottom: 10, padding: '8px 14px', background: '#f8fafc', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Compte :</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', fontFamily: 'monospace' }}>{compte.code_du_compte}</span>
          </div>

          <Section icon={CreditCard} title="Information de compte">
            <Field label="Nom" value={compte.nom} />
            <Field label="Prénom" value={compte.prenom} />
            <Field label="Code du compte" value={compte.code_du_compte} />
            <Field label="État" value={compte.etat} />
            <Field label="Flag de paiement" value={compte.flag_paiement} />
            <Field label="Titre" value={compte.titre} />
            <Field label="Type de compte" value={compte.type_de_compte} />
            <Field label="Cycle de facturation" value={compte.cycle_de_facturation} />
            <Field label="Langue parlée" value={compte.langue_parlee} />
            <Field label="Date de création" value={compte.date_creation} />
            <Field label="Date effective" value={compte.date_effective} />
            <Field label="Date de modification" value={compte.date_modification} />
            <Field label="Expire le" value={compte.expire_le} />
            <Field label="Sous DC" value={compte.sous_dc} />
            <Field label="A PA" value={compte.a_pa} />
            <Field label="Exemption contrôle crédit" value={compte.exemption_controle_credit} />
            <Field label="Code d'Actel" value={compte.code_actel} />
          </Section>

          <Section icon={MapPin} title="Information d'adresse">
            <Field label="Pays" value={compte.pays || 'ALGÉRIE'} />
            <Field label="Wilaya" value={compte.wilaya} />
            <Field label="Daïra" value={compte.daira} />
            <Field label="Commune" value={compte.commune} />
            <Field label="Rue" value={compte.rue} />
            <Field label="Num. maison" value={compte.num_maison} />
            <Field label="Code postal" value={compte.code_postal} />
            <Field label="Num SMS" value={compte.num_sms} />
            <Field label="Email" value={compte.email} />
          </Section>

          <Section icon={Banknote} title="Mode de paiement" color="linear-gradient(135deg, #065f46, #10b981)">
            <Field label="Mode de paiement" value={compte.mode_paiement} />
            <Field label="État" value={compte.etat} />
            <Field label="Date de création" value={compte.date_creation} />
            <Field label="Date effective" value={compte.date_effective} />
            <Field label="Expire le" value={compte.expire_le} />
            <Field label="Date de modification" value={compte.date_modification} />
          </Section>
        </div>
      ))}
    </div>
  );
}