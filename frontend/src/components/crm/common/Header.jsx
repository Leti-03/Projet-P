import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../../context/crm/AuthContext.jsx';

export default function Header() {
  const { user } = useAuth();

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px', backgroundColor: 'white',
      borderBottom: '1px solid #F0F2F4', height: '60px', boxSizing: 'border-box',
    }}>
      {/* Recherche */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F6FA', borderRadius: 10, padding: '8px 14px', width: 260 }}>
        <Search size={16} color="#999" />
        <input
          placeholder="Rechercher..."
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#333', width: '100%' }}
        />
      </div>

      {/* Droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Bell size={20} color="#555" style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} color="#4CAF50" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
            {user?.prenom} {user?.nom}
          </span>
        </div>
      </div>
    </div>
  );
}