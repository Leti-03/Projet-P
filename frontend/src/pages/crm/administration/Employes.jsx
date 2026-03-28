import React from 'react';
import Layout from '../../../components/crm/common/Layout';
import TableauEmployes from '../../../components/crm/administration/TableauEmployes';
import FormulaireEmploye from '../../../components/crm/administration/FormulaireEmploye';

export default function Employes() {
  const employesFictifs = [
    { id: 1, nom: "Admin", email: "admin@it.dz", role: "ADMIN", tel: "0550112233", service: "Direction IT" },
    { id: 2, nom: "Lina", email: "lina@it.dz", role: "COMMERCIAL", tel: "0661445566", service: "Ventes" }
  ];

  return (
    <Layout>
      <div className="animate-page">
        <h1 className="at-title">Gestion des Employés</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          <FormulaireEmploye />
          <TableauEmployes employes={employesFictifs} />
        </div>
      </div>
    </Layout>
  );
}