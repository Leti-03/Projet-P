import React from 'react';
import Layout from '../../components/crm/common/Layout';
import CarteRecap from '../../components/crm/dashboard/CarteRecap';
import DernieresActivites from '../../components/crm/dashboard/DernieresActivites';
import { Users, FileText, AlertCircle, Zap } from 'lucide-react';

export default function Dashboard() {
  return (
    <Layout>
      <div className="animate-page">
        <h1 className="at-title">Tableau de bord</h1>
        <p className="at-subtitle">Bienvenue sur votre gestionnaire IT-Telecom</p>

        {/* Section Stats */}
        <div className="at-grid" style={{ marginBottom: '30px' }}>
          <CarteRecap titre="Clients Totaux" valeur="1,240" icone={Users} couleur="var(--at-green)" />
          <CarteRecap titre="Factures Impayées" valeur="14" icone={FileText} couleur="#E53E3E" />
          <CarteRecap titre="Réclamations" valeur="05" icone={AlertCircle} couleur="var(--at-orange)" />
          <CarteRecap titre="Offres Actives" valeur="12" icone={Zap} couleur="#3182ce" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
          {/* On pourra mettre un graphique ici plus tard */}
          <div className="at-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0' }}>
            [ Graphique d'évolution des ventes ]
          </div>
          
          <DernieresActivites />
        </div>
      </div>
    </Layout>
  );
}