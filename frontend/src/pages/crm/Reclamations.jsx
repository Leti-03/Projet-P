import React, { useState } from 'react';
import Layout from '../../components/crm/common/Layout';
import Tableau from '../../components/crm/common/Tableau';
import Bouton from '../../components/crm/common/Bouton';
import Modal from '../../components/crm/common/Modal';
import FormulaireReclamation from '../../components/crm/reclamations/FormulaireReclamation';
import { AlertTriangle } from 'lucide-react';

export default function Reclamations() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 className="at-title">Gestion des Réclamations</h1>
        <Bouton icon={AlertTriangle} onClick={() => setIsModalOpen(true)}>
          Déposer un litige
        </Bouton>
      </div>

      <Tableau 
        colonnes={[{label: "Objet", key: "objet"}, {label: "Client", key: "client"}]} 
        donnees={[{objet: "Coupure Internet", client: "Sarl Tech"}]} 
      />

      {/* AFFICHAGE DU COMPOSANT FORMULAIRE DANS LA MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Réclamation">
        <FormulaireReclamation />
      </Modal>
    </Layout>
  );
}