  
import { useNavigate } from 'react-router-dom';

export default function UpcomingInvoice() {
  const navigate = useNavigate();

  // Données mock - à remplacer par API réelle
  const invoice = {
    amount: 3500,
    dueDate: '2026-04-05',
    status: 'pending'
  };

  const dueDateFormatted = new Date(invoice.dueDate).toLocaleDateString('fr-DZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
          background: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20
        }}>
          💳
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Prochaine facture</div>
          <div style={{ fontSize: 11, color: '#999' }}>Échéance à venir</div>
        </div>
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>
        {invoice.amount.toLocaleString()} DA
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        À payer avant le {dueDateFormatted}
      </div>

      <div style={{
        fontSize: 11,
        color: '#EF4444',
        background: '#FEF2F2',
        padding: '6px 12px',
        borderRadius: 8,
        display: 'inline-block'
      }}>
        🔴 Impayé
      </div>
    </div>
  );
}