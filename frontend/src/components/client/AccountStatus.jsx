  
import { useNavigate } from 'react-router-dom';

export default function AccountStatus() {
  const navigate = useNavigate();

  // Données mock - à remplacer par API réelle
  const account = {
    plan: 'Fibre Premium',
    speed: '500 Mbps',
    balance: 0,
    nextPayment: '2026-04-05',
    nextPaymentAmount: 3500
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '1px solid #E8EDE8',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
      onClick={() => navigate('/client/factures')}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: '#EFF6FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20
        }}>
          📊
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Statut compte</div>
          <div style={{ fontSize: 11, color: '#999' }}>Votre formule actuelle</div>
        </div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>
        {account.plan}
      </div>
      <div style={{ fontSize: 11, color: '#4CAF50', marginBottom: 14 }}>
        {account.speed}
      </div>

      <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12, marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: '#888' }}>Solde</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: account.balance === 0 ? '#22C55E' : '#EF4444' }}>
            {account.balance} DA
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#888' }}>Prochain prélèvement</span>
          <span style={{ fontSize: 11, color: '#666' }}>
            {new Date(account.nextPayment).toLocaleDateString('fr-DZ')}
          </span>
        </div>
      </div>
    </div>
  );
}