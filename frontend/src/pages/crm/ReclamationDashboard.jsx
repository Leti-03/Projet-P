import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import ReclamationModal from '../../components/crm/reclamations/ReclamationModal';

export default function Reclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      // On récupère uniquement les réclamations qui n'ont pas encore de technicien
      const res = await axios.get('http://localhost:5000/api/reclamations?statut=ouvert');
      setReclamations(res.data.data);
    } catch (err) { 
      console.error("Erreur chargement tickets", err); 
    }
  };

  useEffect(() => { 
    fetchTickets(); 
  }, []);

  return (
    <div className="main-content">
      <div className="rec-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="at-title" style={{ margin: 0 }}>Tickets Desk</h1>
          <p className="at-subtitle">Assignez les réclamations clients aux techniciens disponibles</p>
        </div>
        <div className="at-badge badge-pending" style={{ padding: '8px 15px', borderRadius: '20px' }}>
          {reclamations.length} En attente
        </div>
      </div>

      <div className="at-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {reclamations.map(ticket => (
          <div key={ticket.id} className="rec-card" onClick={() => setSelectedTicket(ticket)} style={{ cursor: 'pointer' }}>
            <div className={`prio-indicator prio-${ticket.priorite}`}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="at-badge badge-pending" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                {ticket.type_probleme}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {ticket.id.slice(0, 8)}</span>
            </div>

            <h4 style={{ margin: '12px 0 6px 0', color: '#1A1A1A' }}>{ticket.titre}</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#718096' }}>
              <MapPin size={14} /> {ticket.region}
            </div>

            <div style={{ 
              marginTop: '15px', 
              paddingTop: '10px', 
              borderTop: '1px solid #F0F2F4', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>
                {ticket.client?.nom} {ticket.client?.prenom}
              </span>
              <ChevronRight size={18} color="#4CAF50" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal qui s'ouvre pour l'assignation */}
      {selectedTicket && (
        <ReclamationModal 
          ticket={selectedTicket} 
          onClose={() => { 
            setSelectedTicket(null); 
            fetchTickets(); 
          }} 
        />
      )}
    </div>
  );
}