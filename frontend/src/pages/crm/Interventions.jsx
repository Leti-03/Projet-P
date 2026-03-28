import React from 'react';
import Layout from '../../components/crm/common/Layout';
import CarteIntervention from '../../components/crm/interventions/CarteIntervention';

export default function Interventions() {
  const interDemo = { type: "Installation", client: "Sarl Tech", adresse: "Bab Ezzouar", date: "30/03/2026" };

  return (
    <Layout>
      <h1 className="at-title">Interventions</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {/* On affiche le composant CARTE INTERVENTION */}
        <CarteIntervention data={interDemo} />
        <CarteIntervention data={{...interDemo, type: "Maintenance", client: "Particulier"}} />
      </div>
    </Layout>
  );
}