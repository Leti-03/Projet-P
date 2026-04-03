import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Clock, MapPin, Wrench, AlertCircle } from 'lucide-react';
import Layout from '../../components/crm/common/Layout';

export default function Assignation() {
  const [tickets, setTickets] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTechs, setLoadingTechs] = useState(false); // ← nouveau

  // Charger uniquement les tickets au départ
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reclamations?statut=ouvert');
        setTickets(res.data.data || []);
      } catch (err) {
        console.error("Erreur tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Charger les suggestions quand un ticket est sélectionné
  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setTechniciens([]);
    setLoadingTechs(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignation/suggestions/${ticket.id}`
      );
      // getSuggestions retourne un tableau de techniciens avec un score
      const suggestions = res.data.suggestions || res.data.data || res.data || [];
      setTechniciens(suggestions);
    } catch (err) {
      console.error("Erreur suggestions:", err);
    } finally {
      setLoadingTechs(false);
    }
  };

  const handleAssign = async (techId) => {
    try {
      await axios.post('http://localhost:5000/api/assignation/manuel', {
        reclamation_id: selectedTicket.id,
        technicien_id: techId
      });
      setTickets(tickets.filter(t => t.id !== selectedTicket.id));
      setSelectedTicket(null);
      setTechniciens([]);
      alert("Ticket assigné avec succès !");
    } catch (err) {
      alert("Erreur lors de l'assignation");
    }
  };

  return (
    <Layout>
      <div className="animate-page">
        <h1 className="at-title">Centre d'Assignation</h1>
        <p className="at-subtitle">Reliez les réclamations aux techniciens disponibles</p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 380px', 
          gap: '25px', 
          marginTop: '20px',
          height: 'calc(100vh - 200px)'
        }}>
          
          {/* COLONNE GAUCHE : TICKETS */}
          <div style={{ overflowY: 'auto', paddingRight: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Clock size={20} color="var(--at-green)" />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Réclamations ({tickets.length})</h3>
            </div>

            {loading ? (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>Chargement...</p>
            ) : tickets.length === 0 ? (
              <div className="at-card" style={{ textAlign: 'center', padding: '40px' }}>
                <AlertCircle size={40} color="#CBD5E1" style={{ marginBottom: '10px' }} />
                <p style={{ color: '#64748B' }}>Aucun ticket en attente.</p>
              </div>
            ) : (
              tickets.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => handleSelectTicket(t)} // ← handleSelectTicket
                  className="at-card"
                  style={{ 
                    cursor: 'pointer', 
                    marginBottom: '15px',
                    border: selectedTicket?.id === t.id ? '2px solid var(--at-green)' : '1px solid #F0F2F4',
                    backgroundColor: selectedTicket?.id === t.id ? '#F0FFF4' : 'white',
                    transition: '0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="at-badge badge-pending" style={{ fontSize: '10px' }}>
                      {t.type_probleme || 'SANS TYPE'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {String(t.id).slice(0,6)}</span>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1A1A1A' }}>{t.titre}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#718096' }}>
                    <MapPin size={14} /> {t.region || 'Non précisée'}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COLONNE DROITE : SUGGESTIONS */}
          <div className="at-card" style={{ 
            background: '#F8FAFB', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '17px' }}>
              <UserPlus size={20} /> Techniciens suggérés
            </h3>

            {selectedTicket ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'white', borderRadius: '10px', borderLeft: '4px solid var(--at-green)', marginBottom: '10px' }}>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Assigner à :</p>
                  <strong style={{ fontSize: '13px' }}>{selectedTicket.titre}</strong>
                </div>

                {loadingTechs ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8' }}>Chargement des suggestions...</p>
                ) : techniciens.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    Aucun technicien disponible.
                  </p>
                ) : (
                  techniciens.map(tech => (
                    <div key={tech.id} style={{ 
                      background: 'white', 
                      padding: '12px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px' }}>{tech.nom} {tech.prenom}</div>
                        <div style={{ fontSize: '11px', color: 'var(--at-green)' }}>{tech.specialite}</div>
                        {/* Affiche le score si disponible */}
                        {tech.score && (
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Score: {tech.score}</div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleAssign(tech.id)}
                        style={{ 
                          background: '#1A1A1A', 
                          color: 'white', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        Assigner
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '60px', color: '#94a3b8' }}>
                <Wrench size={35} style={{ opacity: 0.2, marginBottom: '10px' }} />
                <p style={{ fontSize: '13px' }}>Sélectionnez un ticket à gauche pour voir les suggestions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}