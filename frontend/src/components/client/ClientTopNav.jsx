import React from 'react';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function ClientTopNav({ title, subtitle }) {
  const { client } = useAuth();

  return (
    <div className="client-topnav" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px'
    }}>
      {/* Titres à gauche */}
      <div>
        <h1 className="at-title" style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="at-subtitle" style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Icône Message */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <MessageSquare size={20} color="#64748b" />
        </button>

        {/* Bloc Profil (Nom + Avatar uniquement) */}
        <div className="client-topnav-profile" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          background: 'white',
          padding: '6px 16px 6px 6px', // Padding ajusté pour l'avatar à droite
          borderRadius: '12px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          {/* Nom du client */}
          <span style={{ 
            fontWeight: '700', 
            fontSize: '14px', 
            color: '#1e293b',
            paddingLeft: '10px' 
          }}>
            {client ? `${client.prenom} ${client.nom}` : 'Admin'}
          </span>
          
          {/* Avatar (cercle vert pâle avec icône verte) */}
          <div style={{ 
            width: '35px', 
            height: '35px', 
            borderRadius: '10px', 
            background: '#f0fdf4', // Vert très pâle
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <User size={18} color="#22c55e" /> {/* Icône verte */}
          </div>
        </div>
      </div>
    </div>
  );
}