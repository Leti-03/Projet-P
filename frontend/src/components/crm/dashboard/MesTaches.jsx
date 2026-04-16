import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

const TACHES_DEFAUT = [
  { id: 1, texte: 'Vérifier les réclamations urgentes', fait: false },
  { id: 2, texte: 'Relancer les factures en retard',   fait: false },
  { id: 3, texte: 'Valider les nouvelles demandes',    fait: true  },
];

export default function MesTaches() {
  const [taches, setTaches] = useState(TACHES_DEFAUT);
  const [input, setInput]   = useState('');

  const toggle = (id) => setTaches((prev) => prev.map((t) => t.id === id ? { ...t, fait: !t.fait } : t));

  const ajouter = () => {
    const txt = input.trim();
    if (!txt) return;
    setTaches((prev) => [...prev, { id: Date.now(), texte: txt, fait: false }]);
    setInput('');
  };

  const fait  = taches.filter((t) => t.fait).length;
  const total = taches.length;

  return (
    <div className="at-card" style={{ padding: 24, cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Mes tâches</h3>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#E8F5E9', color: '#4CAF50' }}>{fait}/{total}</span>
      </div>

      {/* Barre de progression */}
      <div style={{ height: 4, background: '#F0F2F4', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#4CAF50', borderRadius: 2, width: total > 0 ? `${Math.round((fait / total) * 100)}%` : '0%', transition: 'width 0.4s ease' }} />
      </div>

      <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 200, overflowY: 'auto' }}>
        {taches.map((t) => (
          <li
            key={t.id}
            onClick={() => toggle(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            {t.fait
              ? <CheckCircle2 size={18} color="#4CAF50" style={{ flexShrink: 0 }} />
              : <Circle size={18} color="#D1D5DB" style={{ flexShrink: 0 }} />
            }
            <span style={{ fontSize: 13, color: t.fait ? 'var(--at-text-sub)' : '#1A202C', textDecoration: t.fait ? 'line-through' : 'none', transition: 'all 0.2s' }}>
              {t.texte}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ajouter()}
          placeholder="Ajouter une tâche…"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #F0F2F4', borderRadius: 10, fontSize: 12, fontFamily: 'Poppins, sans-serif', outline: 'none', background: '#F8FAFB' }}
        />
        <button
          onClick={ajouter}
          style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#E8F5E9', color: '#4CAF50', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}