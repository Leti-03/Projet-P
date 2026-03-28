import React from 'react';
import Layout from '../../components/crm/common/Layout';
import CarteStat from '../../components/crm/statistiques/CarteStat';
import TableauStats from '../../components/crm/statistiques/TableauStats';
import Graphique from '../../components/crm/statistiques/Graphique';

export default function Statistiques() {
  const dataVentes = [
    { offre: "Fibre Pro Max", ventes: 120, part: "60%" },
    { offre: "Fibre Home Plus", ventes: 80, part: "40%" },
    { offre: "ADSL Home", ventes: 45, part: "25%" }
  ];

  return (
    <Layout>
      <h1 className="at-title">Analyses & Performance</h1>
      
      <div className="at-grid" style={{ marginBottom: '30px' }}>
        <CarteStat titre="Chiffre d'Affaires" valeur="850.000 DA" progression="+15%" />
        <CarteStat titre="Nouveaux Clients" valeur="+42" progression="+8%" />
        <CarteStat titre="Taux de Résiliation" valeur="2.4%" progression="-1.2%" estPositif={false} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <Graphique titre="Évolution des Revenus" />
        <TableauStats donnees={dataVentes} />
      </div>
    </Layout>
  );
}