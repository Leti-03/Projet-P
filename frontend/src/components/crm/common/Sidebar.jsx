import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, MessageSquare, FileText, 
  Wrench, Percent, BarChart3, Settings, LogOut, UserPlus,
  ClipboardList
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard',    path: '/crm/dashboard',                icon: LayoutDashboard },
  { label: 'Base Clients', path: '/crm/clients',                  icon: Users },
  { label: 'Tickets Desk', path: '/crm/reclamations',             icon: MessageSquare },
  { label: 'Assigner',     path: '/crm/assignation',              icon: UserPlus },
  { label: 'Facturation',  path: '/crm/factures',                 icon: FileText },
  { label: 'Demandes',     path: '/crm/demandes',                 icon: ClipboardList },
  { label: 'Intervent.',   path: '/crm/interventions',            icon: Wrench },
  { label: 'Offres',       path: '/crm/offres',                   icon: Percent },
  { label: 'Stats',        path: '/crm/statistiques',             icon: BarChart3 },
  { label: 'Employés',     path: '/crm/administration/employes',  icon: Settings },
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
      display: 'flex', flexDirection: isMobile ? 'row' : 'column', 
      height: isMobile ? '70px' : '100vh', width: '100%', alignItems: 'center', 
      padding: isMobile ? '0 10px' : '15px 0', backgroundColor: 'white',
      borderRight: isMobile ? 'none' : '1px solid #F0F2F4',
      borderTop: isMobile ? '1px solid #F0F2F4' : 'none',
      boxSizing: 'border-box', overflow: 'hidden' 
    }}>
      
      {!isMobile && (
        <div style={{ marginBottom: '2vh', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '22px', fontWeight: '900', display: 'flex' }}>
            A<span style={{ color: '#4CAF50' }}>T</span>
          </div>
          <div style={{ width: '20px', height: '3px', background: '#4CAF50', borderRadius: '2px' }}></div>
        </div>
      )}

      <div className="sidebar-scroll-area" style={{ 
        flex: 1, display: 'flex', flexDirection: isMobile ? 'row' : 'column', 
        alignItems: 'center', justifyContent: isMobile ? 'space-around' : 'flex-start', 
        width: '100%', gap: isMobile ? '0' : '8px', overflowY: isMobile ? 'hidden' : 'auto',
        paddingTop: '10px'
      }}>
        <style>{`.sidebar-scroll-area::-webkit-scrollbar { display: none; }`}</style>
        
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          // Pour "Demandes", on marque actif si le path commence par /crm/demandes
          const isActive = item.path === '/crm/demandes'
            ? location.pathname.startsWith('/crm/demandes')
            : location.pathname === item.path;
          
          return (
            <button 
              key={i} 
              onClick={() => navigate(item.path)} 
              style={{
                width: isMobile ? 'auto' : '100%', background: 'transparent', border: 'none',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '4px 0', flexShrink: 0,
                color: isActive ? '#4CAF50' : '#1A1A1A',
              }}
            >
              <div style={{
                width: '38px', height: '38px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', borderRadius: '10px',
                background: isActive ? '#E8F5E9' : 'transparent',
              }}>
                <Icon size={isMobile ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!isMobile && <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '500', marginTop: '2px' }}>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {!isMobile && (
        <div 
          onClick={() => navigate('/login')}
          style={{ marginTop: 'auto', paddingBottom: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8B0000', cursor: 'pointer', flexShrink: 0 }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '10px', fontWeight: '600' }}>Logout</span>
        </div>
      )}
    </div>
  );
}