// src/components/crm/common/Sidebar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, FileText,
  Wrench, Percent, BarChart3, Settings, LogOut,
  UserCog, Shield, SlidersHorizontal, ChevronDown, ChevronUp, Activity,
  UserPlus, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../../context/crm/AuthContext.jsx';

// ── Récupère le nombre de tickets urgents ────────────────────────────────────
// Adapter l'URL à votre API
const fetchUrgentTicketsCount = async () => {
  try {
    const res = await fetch('/api/crm/reclamations?statut=ouvert&priorite=urgent&limit=1', {
      headers: { Authorization: `Bearer ${localStorage.getItem('crm_token')}` },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    // Adapter selon la structure de votre réponse :
    // { total: N } ou { count: N } ou un tableau
    return data.total ?? data.count ?? (Array.isArray(data) ? data.length : 0);
  } catch {
    return 0;
  }
};

const menuItems = [
  { label: 'Dashboard',   path: '/crm/dashboard',    icon: LayoutDashboard },
  { label: 'Clients',     path: '/crm/clients',       icon: Users },
  { label: 'Tickets',     path: '/crm/reclamations',  icon: MessageSquare, badge: true }, // ← badge activé
  { label: 'Assigner',    path: '/crm/assignation',   icon: UserPlus },
  { label: 'Facturation', path: '/crm/factures',      icon: FileText },
  { label: 'Demandes',    path: '/crm/demandes',      icon: ClipboardList },
  { label: 'Intervent.',  path: '/crm/interventions', icon: Wrench },
  { label: 'Offres',      path: '/crm/offres',        icon: Percent },
  { label: 'Stats',       path: '/crm/statistiques',  icon: BarChart3 },
];

const adminItems = [
  { label: 'Employés',   path: '/crm/administration/employes',   icon: UserCog },
  { label: 'Profils',    path: '/crm/administration/profils',    icon: Shield },
  { label: 'Logs',       path: '/crm/administration/logs',       icon: Activity },
  { label: 'Paramètres', path: '/crm/administration/parametres', icon: SlidersHorizontal },
];

export default function Sidebar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile]     = useState(window.innerWidth <= 768);
  const [adminOpen, setAdminOpen]   = useState(location.pathname.startsWith('/crm/administration'));
  const [urgentCount, setUrgentCount] = useState(0);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ouvrir admin si on est sur une page admin
  useEffect(() => {
    if (location.pathname.startsWith('/crm/administration')) setAdminOpen(true);
  }, [location.pathname]);

  // Charger les tickets urgents au montage + toutes les 60s
  useEffect(() => {
    const load = async () => {
      const count = await fetchUrgentTicketsCount();
      setUrgentCount(count);
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/crm/login');
  };

  const isAdminPage = location.pathname.startsWith('/crm/administration');
  const isAdmin     = user?.est_superadmin || false;

  // ── Badge helpers ────────────────────────────────────────────────────────
  const BadgeCount = ({ count, mobile = false }) => {
    if (!count || count === 0) return null;
    return (
      <div style={{
        position: 'absolute',
        top: mobile ? -3 : -4,
        right: mobile ? -3 : -4,
        minWidth: 16,
        height: 16,
        borderRadius: 999,
        background: '#ef4444',
        color: 'white',
        fontSize: 9,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
        border: '2px solid white',
        boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
        fontFamily: "'Poppins', sans-serif",
        animation: count > 0 ? 'badgePulse 2s ease-in-out infinite' : 'none',
        zIndex: 10,
      }}>
        {count > 99 ? '99+' : count}
      </div>
    );
  };

  // ── Mobile ──
  if (isMobile) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', height: '70px', width: '100%',
        alignItems: 'center', justifyContent: 'space-around', padding: '0 10px',
        backgroundColor: 'white', borderTop: '1px solid #F0F2F4', boxSizing: 'border-box',
      }}>
        <style>{`
          @keyframes badgePulse {
            0%, 100% { box-shadow: 0 2px 6px rgba(239,68,68,0.4); }
            50%       { box-shadow: 0 2px 12px rgba(239,68,68,0.7); }
          }
        `}</style>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = item.path === '/crm/demandes'
            ? location.pathname.startsWith('/crm/demandes')
            : location.pathname === item.path;
          const showBadge = item.badge && urgentCount > 0;
          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isActive ? '#4CAF50' : '#1A1A1A', position: 'relative' }}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && <BadgeCount count={urgentCount} mobile />}
              </div>
            </button>
          );
        })}
        {isAdmin && (
          <button
            onClick={() => navigate('/crm/administration/employes')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isAdminPage ? '#4CAF50' : '#1A1A1A' }}
          >
            <Settings size={20} strokeWidth={isAdminPage ? 2.5 : 2} />
          </button>
        )}
      </div>
    );
  }

  // ── Desktop ──
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100%',
      alignItems: 'center', padding: '15px 0', backgroundColor: 'white',
      borderRight: '1px solid #F0F2F4', boxSizing: 'border-box', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 2px 6px rgba(239,68,68,0.4); }
          50%       { box-shadow: 0 2px 12px rgba(239,68,68,0.7); }
        }
      `}</style>

      {/* Logo */}
      <div style={{ marginBottom: '2vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: '900', display: 'flex' }}>
          A<span style={{ color: '#4CAF50' }}>T</span>
        </div>
        <div style={{ width: '20px', height: '3px', background: '#4CAF50', borderRadius: '2px' }} />
      </div>

      {/* Menu */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '6px', overflowY: 'auto' }}>

        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = item.path === '/crm/demandes'
            ? location.pathname.startsWith('/crm/demandes')
            : location.pathname === item.path;
          const showBadge = item.badge && urgentCount > 0;

          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '4px 0', color: isActive ? '#4CAF50' : '#1A1A1A',
              }}
            >
              <div style={{
                width: '38px', height: '38px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '10px',
                background: isActive ? '#E8F5E9' : 'transparent',
                position: 'relative',
              }}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && <BadgeCount count={urgentCount} />}
              </div>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '500', marginTop: '2px' }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Section Admin */}
        {isAdmin && (
          <>
            <div style={{ width: '32px', height: '1px', background: '#E0E0E0', margin: '4px 0' }} />

            <button
              onClick={() => setAdminOpen(!adminOpen)}
              style={{
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '4px 0', color: isAdminPage ? '#4CAF50' : '#1A1A1A',
              }}
            >
              <div style={{
                width: '38px', height: '38px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '10px',
                background: isAdminPage ? '#E8F5E9' : 'transparent',
                position: 'relative',
              }}>
                <Settings size={22} strokeWidth={isAdminPage ? 2.5 : 2} />
                <div style={{ position: 'absolute', bottom: 1, right: 1, color: '#999' }}>
                  {adminOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: isAdminPage ? '700' : '500', marginTop: '2px' }}>Admin</span>
            </button>

            {adminOpen && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '6px 0' }}>
                {adminItems.map((item, i) => {
                  const Icon     = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={i}
                      onClick={() => navigate(item.path)}
                      style={{
                        width: '85%', background: isActive ? '#E8F5E9' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '6px 0', borderRadius: '8px',
                        color: isActive ? '#4CAF50' : '#555',
                      }}
                    >
                      <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                      <span style={{ fontSize: '9px', fontWeight: isActive ? '700' : '500', marginTop: '2px' }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: 'auto', paddingBottom: '10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          color: '#8B0000', cursor: 'pointer', opacity: 0.8,
          background: 'none', border: 'none', width: '100%',
        }}
      >
        <LogOut size={18} />
        <span style={{ fontSize: '10px', fontWeight: '600' }}>Logout</span>
      </button>
    </div>
  );
}