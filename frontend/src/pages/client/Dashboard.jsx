import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/client/ClientSidebar';
import AccountStatus from '../../components/client/AccountStatus';
import UpcomingInvoice from '../../components/client/UpcomingInvoice';
import QuickAssistant from '../../components/client/QuickAssistant';
import Announcements from '../../components/client/Announcements';

export default function Dashboard() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('Anais');

  // Date du jour formatée
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-DZ', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#F0F2F0', 
      fontFamily: "'Poppins', sans-serif", 
      overflow: 'hidden', 
      display: 'flex' 
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{ opacity:0; transform:translateY(12px) } to{ opacity:1; transform:none } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D0D8D0; border-radius: 2px; }
      `}</style>

      <ClientSidebar />

      <div style={{ 
        marginLeft: 78, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        padding: '20px 28px 20px 20px', 
        gap: 20,
        overflowY: 'auto'
      }}>
        
        {/* En-tête */}
        <div style={{ animation: 'fadeUp 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>Dashboard</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Vue d'ensemble de votre espace client</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/client/notifications')}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: 'white', border: '1px solid #E8EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#EF4444', border: '2px solid #F0F2F0', fontSize: 9, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                {clientName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div style={{ 
          background: 'white', 
          borderRadius: 20, 
          padding: '22px 26px', 
          border: '1px solid #E8EDE8',
          animation: 'fadeUp 0.35s both'
        }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1a1a1a' }}>
            🌟 Bonjour {clientName} !
          </div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
            Nous sommes le {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}. Tout va bien sur votre compte.
          </div>
        </div>

        {/* Deux cartes principales (Statut + Facture) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 20,
          animation: 'fadeUp 0.4s both'
        }}>
          <AccountStatus />
          <UpcomingInvoice />
        </div>

        {/* Assistant */}
        <div style={{ animation: 'fadeUp 0.45s both' }}>
          <QuickAssistant />
        </div>

        {/* Annonces */}
        <div style={{ animation: 'fadeUp 0.5s both' }}>
          <Announcements />
        </div>
        
      </div>
    </div>
  );
}