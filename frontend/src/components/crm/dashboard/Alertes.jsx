import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CONFIG = {
  danger:  { Icon: XCircle,       bg: '#FFEBEE', border: '#FFCDD2', color: '#D32F2F' },
  warning: { Icon: AlertTriangle, bg: '#FFF3E0', border: '#FFE0B2', color: '#EF6C00' },
  info:    { Icon: Info,          bg: '#E3F2FD', border: '#BBDEFB', color: '#1565C0' },
  success: { Icon: CheckCircle,   bg: '#E8F5E9', border: '#C8E6C9', color: '#2E7D32' },
};

export default function Alertes({ data, loading }) {
  const navigate = useNavigate();

  return (
    <div className="at-card" style={{ padding: 24, cursor: 'default' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1A202C' }}>Alertes</h3>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map((i) => <div key={i} style={{ height: 44, background: '#F0F2F4', borderRadius: 10 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(data || []).map((alerte, i) => {
            const c = CONFIG[alerte.type] || CONFIG.info;
            return (
              <div
                key={i}
                onClick={() => alerte.lien && navigate(alerte.lien)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  background: c.bg, border: `1px solid ${c.border}`,
                  cursor: alerte.lien ? 'pointer' : 'default',
                }}
              >
                <c.Icon size={15} color={c.color} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: c.color, fontWeight: 500, lineHeight: 1.4 }}>{alerte.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}