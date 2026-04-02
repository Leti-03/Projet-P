// src/components/client/ClientSidebar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, AlertCircle, Shield, Clock,
  Star, FileText, Bot, LogOut, PlusSquare, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { label: 'Notifications', path: '/client/notifications',   icon: Bell          },
  { label: 'Réclamations',  path: '/client/reclamation',     icon: AlertCircle   },
  { label: 'Demande',       path: '/client/demande-service', icon: PlusSquare    },
  { label: 'Mes demandes',  path: '/client/mes-demandes',    icon: ClipboardList },
  { label: 'Suivi',         path: '/client/suivi',           icon: Shield        },
  { label: 'Historique',    path: '/client/historique',      icon: Clock         },
  { label: 'Promotions',    path: '/client/promotions',      icon: Star          },
  { label: 'Factures',      path: '/client/factures',        icon: FileText      },
  { label: 'Assistant',     path: '/client/assistant',       icon: Bot           },
];

export default function ClientSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useAuth();
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    navigate('/welcome', { replace: true });
    setTimeout(() => { logout(); }, 100);
  };

  return (
    <aside className="client-sidebar-aside">
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        padding: isMobile ? '0 10px' : '15px 0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>

        {/* ── Logo AT ── */}
        {!isMobile && (
          <div
            onClick={() => navigate('/client/dashboard')}
            style={{ marginBottom: '2vh', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '22px', fontWeight: '900', display: 'flex', fontFamily: 'Poppins, sans-serif' }}>
              A<span style={{ color: '#4CAF50' }}>T</span>
            </div>
            <div style={{ width: '20px', height: '3px', background: '#4CAF50', borderRadius: '2px' }}/>
          </div>
        )}

        {/* ── Menu Items ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-around' : 'center',
          width: '100%',
          gap: isMobile ? '0' : '4px',
        }}>
          {menuItems.map((item, i) => {
            const Icon     = item.icon;
            const isActive  = location.pathname === item.path;
            const isHovered = hovered === i;
            const isGreen   = isActive || isHovered;

            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
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
                }}
              >
                <div style={{
                  width: '42px', height: '42px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px',
                  background: isActive ? '#E8F5E9' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isGreen ? '#4CAF50' : '#1A1A1A'}
                    style={{ transition: 'color 0.2s' }}
                  />
                </div>
                {!isMobile && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: isActive ? '700' : '500',
                    marginTop: '2px',
                    textAlign: 'center',
                    color: isGreen ? '#4CAF50' : '#1A1A1A',
                    transition: 'color 0.2s',
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Logout Button ── */}
        {!isMobile && (
          <div
            onClick={handleLogout}
            onMouseEnter={() => setHovered('out')}
            onMouseLeave={() => setHovered(null)}
            style={{ marginTop: 'auto', paddingBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
          >
            <LogOut size={18} color={hovered === 'out' ? '#E53935' : '#8B0000'} style={{ transition: 'color 0.2s' }} />
          </div>
        )}
      </div>
    </aside>
  );
}