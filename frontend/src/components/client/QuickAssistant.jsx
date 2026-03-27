  
import { useNavigate } from 'react-router-dom';

export default function QuickAssistant() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '1px solid #E8EDE8',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
      onClick={() => navigate('/client/assistant')}
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
          background: '#F0FDF4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20
        }}>
          🤖
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Assistant</div>
          <div style={{ fontSize: 11, color: '#999' }}>Besoin d'aide ?</div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
        Posez vos questions, obtenez des réponses instantanées ou contactez notre support.
      </div>

      <button style={{
        width: '100%',
        background: '#4CAF50',
        border: 'none',
        padding: '10px',
        borderRadius: 12,
        color: 'white',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.2s'
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#43A047'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#4CAF50'}
      >
        💬 Poser une question
      </button>
    </div>
  );
}