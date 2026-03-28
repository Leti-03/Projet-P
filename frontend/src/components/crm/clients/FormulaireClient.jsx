import React from 'react';
import Bouton from '../common/Bouton';

export default function FormulaireClient() {
  return (
    <form className="at-card" style={{ padding: '25px' }}>
      <h3 style={{ marginTop: 0 }}>Nouveau Client</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <input type="text" className="at-input" placeholder="Nom de l'entreprise" />
        <input type="text" className="at-input" placeholder="Contact principal" />
        <input type="email" className="at-input" placeholder="Email" />
        <input type="text" className="at-input" placeholder="Téléphone" />
        <textarea className="at-input" placeholder="Adresse complète" style={{ gridColumn: 'span 2', height: '80px' }}></textarea>
      </div>
      <Bouton style={{ marginTop: '20px' }}>Créer la fiche client</Bouton>
    </form>
  );
}