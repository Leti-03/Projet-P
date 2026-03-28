import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../../hooks/usePermission';

export default function ActionsRapides() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const actions = [
    {
      label: 'Nouveau client',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 18v2h14v-2c0-2-2-4-7-4s-7 2-7 4z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 4v4M14 6h-4" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      permission: 'clients:create',
      onClick: () => navigate('/crm/clients?action=create')
    },
    {
      label: 'Nouvelle facture',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 3v4" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      permission: 'factures:create',
      onClick: () => navigate('/crm/factures?action=create')
    },
    {
      label: 'Nouvelle réclamation',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="6" width="2" height="8" rx="1" fill="currentColor"/>
          <circle cx="12" cy="17" r="1.3" fill="currentColor"/>
          <path d="M12 8v2" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      permission: 'reclamations:create',
      onClick: () => navigate('/crm/reclamations?action=create')
    },
    {
      label: 'Nouvelle intervention',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35 5.25-1.2 9-6.1 9-11.35V7L12 2z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      permission: 'interventions:create',
      onClick: () => navigate('/crm/interventions?action=create')
    },
    {
      label: 'Nouveau devis',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      permission: 'offres:create',
      onClick: () => navigate('/crm/offres?action=create')
    },
  ];

  const visibleActions = actions.filter(action => {
    if (!action.permission) return true;
    return hasPermission(action.permission);
  });

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid #F0F0F0',
      padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '0 0 16px 0' }}>
        Actions rapides
      </h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {visibleActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: '#F8F9FA',
              border: '1px solid #E8E8E8',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: 13,
              fontWeight: 500,
              color: '#2E7D32',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F0F7F0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F8F9FA';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}