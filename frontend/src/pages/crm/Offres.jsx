import React from 'react';
import Layout from '../../components/crm/common/Layout';
import CarteOffre from '../../components/crm/offres/CarteOffre'; // Assure-toi d'avoir créé ce fichier

export default function Offres() {
  const offres = [
    { id: 1, nom: "Fibre Pro", prix: "7500 DA", debit: "100 Mbps" },
    { id: 2, nom: "ADSL Home", prix: "2500 DA", debit: "20 Mbps" },
    { id: 3, nom: "4G Mobile", prix: "1500 DA", debit: "Unlimited" }
  ];

  return (
    <Layout>
      <h1 className="at-title" style={{ marginBottom: '30px' }}>Catalogue des Offres</h1>
      
      {/* AFFICHAGE DES COMPOSANTS CARTE OFFRE EN GRILLE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {offres.map(offre => (
          <div key={offre.id} className="at-card" style={{ padding: '20px', borderTop: '4px solid var(--at-green)' }}>
             <h3 style={{ margin: '0 0 10px 0' }}>{offre.nom}</h3>
             <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{offre.prix}</p>
             <span style={{ color: 'var(--at-text-sub)' }}>Débit: {offre.debit}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}