import React from 'react';
import Layout from '../../components/crm/common/Layout';
import CarteFacture from '../../components/crm/factures/CarteFacture';
import Tableau from '../../components/crm/common/Tableau';

export default function Factures() {
  return (
    <Layout>
      <h1 className="at-title">Facturation</h1>
      
      {/* On affiche 3 CARTES de factures côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <CarteFacture id="FAC-2026-001" montant="15.000" statut="Payée" />
        <CarteFacture id="FAC-2026-002" montant="8.500" statut="En attente" />
        <CarteFacture id="FAC-2026-003" montant="22.000" statut="Payée" />
      </div>

      <Tableau colonnes={[{label: "Réf", key: "id"}]} donnees={[{id: "FAC-2026-001"}]} />
    </Layout>
  );
}