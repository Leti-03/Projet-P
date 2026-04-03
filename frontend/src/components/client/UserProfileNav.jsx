import React from 'react';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function UserProfileNav() {
  const { client, logout } = useAuth();

  // Si pas de client (sécurité), on ne bloque pas l'affichage mais on met des placeholders
  const displayName = client ? `${client.prenom} ${client.nom}` : "Chargement...";
  const displayRole = client?.role || "Client"; // "Client" par défaut si pas de rôle en base

  return (
    <div className="client-topnav-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      {/* Bouton Message / Notification */}
      <button className="client-topnav-icon-btn" title="Messages">
        <MessageSquare size={20} color="#64748b" />
      </button>

      {/* Bloc Profil Réel */}
      <div className="client-topnav-profile" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        background: 'white',
        padding: '6px 16px 6px 6px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9'
      }}>
        {/* Avatar Dynamique */}
        <div className="client-topnav-avatar" style={{ 
          width: '38px', 
          height: '38px', 
          borderRadius: '12px', 
          background: 'rgba(76, 175, 80, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid rgba(76, 175, 80, 0.2)'
        }}>
          <User size={20} color="#4CAF50" />
        </div>

        {/* Textes Dynamiques */}
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span className="client-topnav-profile-name" style={{ 
            fontWeight: '700', 
            fontSize: '14px', 
            color: '#1e293b',
            lineHeight: 1.2
          }}>
            {displayName}
          </span>
          <span style={{ 
            fontSize: '11px', 
            color: '#94a3b8', 
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {displayRole}
          </span>
        </div>
      </div>
    </div>
  );
}