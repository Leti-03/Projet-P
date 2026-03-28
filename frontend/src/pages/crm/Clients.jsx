import React, { useState } from 'react';
import Layout from '../../components/crm/common/Layout';
import Tableau from '../../components/crm/common/Tableau';
import Bouton from '../../components/crm/common/Bouton';
import Modal from '../../components/crm/common/Modal'; // On importe la Modal
import FormulaireClient from '../../components/crm/clients/FormulaireClient'; // On importe le formulaire
import { UserPlus, Search } from 'lucide-react';

export default function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour ouvrir/fermer

  const clientsData = [
    { id: 1, entreprise: "Elevendevs Corp", contact: "Lina Sarah", email: "contact@elevendevs.com", tel: "+213 555", ville: "Alger", statut: "Actif" },
  ];

  const colonnes = [
    { label: "Entreprise", key: "entreprise" },
    { label: "Contact", key: "contact" },
    { label: "Email", key: "email" },
    { label: "Statut", render: (item) => <span className="at-badge badge-success">{item.statut}</span> },
  ];

  return (
    <Layout>
      <div className="animate-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1>Base Clients</h1>
          {/* Quand on clique, on passe isModalOpen à true */}
          <Bouton icon={UserPlus} onClick={() => setIsModalOpen(true)}>
            Ajouter un client
          </Bouton>
        </div>

        <Tableau colonnes={colonnes} donnees={clientsData} />

        {/* C'est ICI qu'on appelle la Modal et le Formulaire */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Nouveau Client"
        >
          <FormulaireClient />
        </Modal>
      </div>
    </Layout>
  );
}