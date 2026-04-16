import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, FileText, AlertCircle, Wrench, ClipboardList, BarChart2 } from 'lucide-react';

const ACTIONS = [
  { label: 'Nouveau client',       icon: UserPlus,      to: '/crm/clients/nouveau',         color: '#4CAF50', bg: '#E8F5E9' },
  { label: 'Nouvelle facture',     icon: FileText,      to: '/crm/factures/nouvelle',        color: '#4CAF50', bg: '#E8F5E9' },
  { label: 'Nouvelle réclamation', icon: AlertCircle,   to: '/crm/reclamations/nouvelle',    color: '#EF4444', bg: '#FFEBEE' },
  { label: 'Nouvelle intervention',icon: Wrench,        to: '/crm/interventions/nouvelle',   color: '#FF9800', bg: '#FFF3E0' },
  { label: 'Nouvelle demande',     icon: ClipboardList, to: '/crm/demandes/nouvelle',        color: '#8B5CF6', bg: '#EDE9FE' },
  { label: 'Statistiques',         icon: BarChart2,     to: '/crm/statistiques',             color: '#1565C0', bg: '#E3F2FD' },
];

export default function ActionsRapides() {
  const navigate = useNavigate();

  return (
    <div className="at-card" style={{ padding: 24, cursor: 'default' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Actions rapides</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {ACTIONS.map(({ label, icon: Icon, to, color, bg }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '14px 8px', borderRadius: 14, border: `1px solid ${bg}`,
              background: bg, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'Poppins, sans-serif',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Icon size={20} color={color} />
            <span style={{ fontSize: 11, fontWeight: 600, color, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}