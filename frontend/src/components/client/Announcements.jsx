 
export default function Announcements() {
  // Données mock - à remplacer par API réelle
  const announcements = [
    {
      id: 1,
      type: 'promo',
      title: 'Promo exceptionnelle',
      message: '-20% sur votre prochaine facture en avril',
      icon: '🎉',
      color: '#EC489A'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance prévue',
      message: 'Le 28/03/2026 de 02h à 04h - service internet',
      icon: '🔧',
      color: '#F59E0B'
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '1px solid #E8EDE8',
      padding: '16px 20px',
      marginBottom: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>📢</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>En ce moment</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {announcements.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: '#F9FAFB',
              borderRadius: 12,
              border: `1px solid ${item.color}20`
            }}
          >
            <div style={{ fontSize: 18 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: item.color, marginBottom: 2 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 11, color: '#666' }}>
                {item.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}