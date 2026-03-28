import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, MessageSquare, FileText, 
  Wrench, Percent, BarChart3, Settings, LogOut 
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/crm/dashboard', icon: LayoutDashboard },
  { label: 'Base Clients', path: '/crm/clients', icon: Users },
  { label: 'Tickets Desk', path: '/crm/reclamations', icon: MessageSquare },
  { label: 'Facturation', path: '/crm/factures', icon: FileText },
  { label: 'Intervent.', path: '/crm/interventions', icon: Wrench },
  { label: 'Offres', path: '/crm/offres', icon: Percent },
  { label: 'Stats', path: '/crm/statistiques', icon: BarChart3 },
  { label: 'Admin', path: '/crm/administration/profils', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'row' : 'column', 
      height: isMobile ? '70px' : '100vh', // Prend toute la hauteur sans dépasser
      width: '100%', 
      alignItems: 'center', 
      padding: isMobile ? '0 10px' : '15px 0',
      backgroundColor: 'white',
      borderRight: isMobile ? 'none' : '1px solid #F0F2F4',
      borderTop: isMobile ? '1px solid #F0F2F4' : 'none',
      boxSizing: 'border-box',
      overflow: 'hidden' // INTERDIT LE SCROLL ICI
    }}>
      
      {/* LOGO COMPACT */}
      {!isMobile && (
        <div style={{ marginBottom: '2vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '900', display: 'flex' }}>
            A<span style={{ color: '#4CAF50' }}>T</span>
          </div>
          <div style={{ width: '20px', height: '3px', background: '#4CAF50', borderRadius: '2px' }}></div>
        </div>
      )}

      {/* MENU ITEMS : Utilisation de flex-grow pour répartir l'espace */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column', 
        alignItems: 'center', 
        justifyContent: isMobile ? 'space-around' : 'center', // Centre verticalement sur PC
        width: '100%', 
        gap: isMobile ? '0' : '8px', // Espace réduit entre les blocs
      }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button 
              key={i} 
              onClick={() => navigate(item.path)} 
              style={{
                width: isMobile ? 'auto' : '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 0',
                transition: '0.3s',
                color: isActive ? '#4CAF50' : '#1A1A1A',
              }}
            >
              <div style={{
                width: '38px', // Taille réduite
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: isActive ? '#E8F5E9' : 'transparent',
              }}>
                <Icon size={isMobile ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {!isMobile && (
                <span style={{ 
                  fontSize: '10px', // Texte plus petit pour gagner de la place
                  fontWeight: isActive ? '700' : '500',
                  marginTop: '2px',
                  textAlign: 'center'
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* LOGOUT TOUT EN BAS */}
      {!isMobile && (
        <div 
          style={{ 
            marginTop: 'auto', 
            paddingBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#8B0000',
            cursor: 'pointer',
            opacity: 0.8
          }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '10px', fontWeight: '600' }}>Logout</span>
        </div>
      )}
    </div>
  );
}