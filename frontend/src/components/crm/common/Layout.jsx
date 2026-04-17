import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ArrowLeft } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/crm/dashboard';

  return (
    <div className="layout-wrapper">
      <aside className="sidebar-aside">
        <Sidebar />
      </aside>

      <main className="main-content">
        <Header />
        {!isDashboard && (
          <div style={{ padding: '20px 32px 0', maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#F8FAFB', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '8px',
                cursor: 'pointer', color: '#475569', fontWeight: 600, fontSize: '13px', 
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              <ArrowLeft size={16} />
              Retour
            </button>
          </div>
        )}
        <div className="animate-page">
          {children}
        </div>
      </main>
    </div>
  );
}