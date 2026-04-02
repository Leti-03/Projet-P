import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Phone, MapPinned, Info, Award } from 'lucide-react';

export default function ReclamationModal({ ticket, onClose }) {
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appelle ton algo de scoring backend
    axios.get(`http://localhost:5000/api/assignation/suggestions/${ticket.id}`)
      .then(res => {
        setTechs(res.data.suggestions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ticket.id]);

  const handleAssignation = async (techId) => {
    try {
      await axios.post('http://localhost:5000/api/assignation/manuel', {
        reclamation_id: ticket.id,
        technicien_id: techId
      });
      alert("Ticket assigné avec succès !");
      onClose();
    } catch (err) {
      alert("Erreur lors de l'assignation");
    }
  };

  return (
    <div className="at-modal-overlay">
      <div className="at-modal-content">
        <button className="client-topnav-icon-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px' }}><X /></button>
        
        {/* Colonne GAUCHE : Infos du ticket client */}
        <div style={{ borderRight: '1px solid #F0F2F4', paddingRight: '20px' }}>
          <h3 style={{ color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={20}/> Détails Client</h3>
          <div className="at-card" style={{ background: '#F8FAFB', marginTop: '15px' }}>
            <p style={{ margin: '5px 0' }}><strong>Nom:</strong> {ticket.client?.nom} {ticket.client?.prenom}</p>
            <p style={{ margin: '5px 0' }}><strong>Tél:</strong> {ticket.client?.telephone}</p>
            <p style={{ margin: '5px 0' }}><strong>Adresse:</strong> {ticket.adresse_probleme}</p>
          </div>
          <h4 style={{ marginTop: '20px' }}>Description du problème :</h4>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{ticket.description}</p>
        </div>

        {/* Colonne DROITE : Choix du technicien */}
        <div>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={20} color="#FF9800"/> Techniciens suggérés</h3>
          {loading ? <p>Calcul du score IA...</p> : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {techs.map(tech => (
                <div key={tech.id} className="tech-item-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="score-circle">{tech.score}%</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A1A1A' }}>{tech.nom}</div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>{tech.charge} tâches en cours • {tech.specialite}</div>
                    </div>
                  </div>
                  <button className="btn-assign-now" onClick={() => handleAssignation(tech.id)}>Assigner</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}