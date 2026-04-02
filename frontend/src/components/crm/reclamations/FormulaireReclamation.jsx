import React from 'react';
import Bouton from '../common/Bouton';

export default function FormulaireReclamation() {
  return (
    <div className="at-card" style={{ padding: '25px' }}>
      <h3>Déposer une Réclamation</h3>
      <input type="text" className="at-input" placeholder="Objet du litige" style={{ width: '100%', marginBottom: '15px' }} />
      <select className="at-input" style={{ width: '100%', marginBottom: '15px' }}>
        <option>Urgence Haute</option>
        <option>Urgence Moyenne</option>
        <option>Urgence Basse</option>
      </select>
      <textarea className="at-input" placeholder="Description détaillée..." style={{ width: '100%', height: '100px' }}></textarea>
      <Bouton style={{ marginTop: '20px' }}>Enregistrer le dossier</Bouton>
    </div>
  );
}