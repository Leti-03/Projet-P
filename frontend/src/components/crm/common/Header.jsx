import React from 'react';
import { Search, Bell, User } from 'lucide-react';
// IMPORT CORRECT : Sans accolades car c'est un export par défaut
import useAuth from '../../../hooks/useAuth'; 

export default function Header() {
  const { user } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      {/* Barre de recherche */}
      <div style={{ position: 'relative', width: '350px' }}>
        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid var(--at-border)', outline: 'none', fontSize: '14px' }}
        />
      </div>

      {/* Profil & Notifs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Bell size={20} color="var(--at-text-sub)" style={{ cursor: 'pointer' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '5px 15px', background: 'white', borderRadius: '15px', border: '1px solid var(--at-border)' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>{user?.name || 'Admin'}</p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--at-green)', fontWeight: '600' }}>{user?.role || 'Rôle'}</p>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--at-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--at-green)' }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}