import React from 'react';
import Bouton from '../common/Bouton';

export default function FormulaireFacture() {
  return (
    <div className="at-card" style={{ padding: '25px' }}>
      <h3>Générer une Facture</h3>
      <select className="at-input" style={{ width: '100%', marginBottom: '15px' }}>
        <option>Sélectionner un client</option>
      </select>
      <select className="at-input" style={{ width: '100%', marginBottom: '15px' }}>
        <option>Sélectionner une offre</option>
      </select>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input type="number" className="at-input" placeholder="Quantité" style={{ flex: 1 }} />
        <input type="text" className="at-input" placeholder="Remise (%)" style={{ flex: 1 }} />
      </div>
      <Bouton style={{ marginTop: '20px', width: '100%' }}>Valider la facturation</Bouton>
    </div>
  );
}