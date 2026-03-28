import React from 'react';
import Bouton from '../common/Bouton';

export default function FormulaireEmploye({ onSubmit }) {
  return (
    <form className="at-card" style={{ padding: '25px' }} onSubmit={onSubmit}>
      <h3 style={{ marginTop: 0 }}>Ajouter un collaborateur</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Nom Complet</label>
          <input type="text" className="at-input" placeholder="Ex: Ahmed Benali" style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Email Professionnel</label>
          <input type="email" className="at-input" placeholder="ahmed@telecom.dz" style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Rôle</label>
          <select className="at-input" style={{ width: '100%' }}>
            <option value="COMMERCIAL">Commercial</option>
            <option value="TECHNICIEN">Technicien</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Téléphone</label>
          <input type="text" className="at-input" placeholder="0550..." style={{ width: '100%' }} />
        </div>
      </div>
      <Bouton type="submit">Enregistrer l'employé</Bouton>
    </form>
  );
}