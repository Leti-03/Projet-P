import React, { useState, useEffect } from 'react';
import { Search, X, User, Calendar, ChevronRight, Loader2 } from 'lucide-react';

export default function RechercheClientModal({ isOpen, onClose, onSearch, results, loading }) {
  const [form, setForm] = useState({ nom: '', prenom: '', date_naissance: '' });
  const [focused, setFocused] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(form);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputStyle = (name) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `2px solid ${focused === name ? '#22c55e' : '#f1f5f9'}`,
    fontSize: 14,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    color: '#1e293b',
    background: focused === name ? '#f0fdf4' : '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
  });

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'Poppins, sans-serif',
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
        @keyframes resultIn {
          from { opacity: 0; transform: translateX(-12px) }
          to   { opacity: 1; transform: translateX(0) }
        }
        .result-card {
          animation: resultIn 0.3s ease forwards;
        }
        .result-card:hover .arrow-icon { transform: translateX(4px); }
        .arrow-icon { transition: transform 0.2s ease; }
        .search-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.35) !important; }
        .search-btn:active { transform: translateY(0); }
        .close-btn:hover { background: rgba(255,255,255,0.25) !important; }
        input::placeholder { color: #cbd5e1; font-family: 'Poppins', sans-serif; font-weight: 400; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
      `}</style>

      {/* Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.25s ease',
        fontFamily: 'Poppins, sans-serif',
      }}>

        {/* Modal */}
        <div style={{
          background: 'white',
          borderRadius: 24,
          width: '100%',
          maxWidth: 580,
          boxShadow: '0 40px 100px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #15803d 0%, #22c55e 60%, #86efac 100%)',
            padding: '28px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                }}>
                  <Search size={22} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{
                    margin: 0, color: 'white', fontSize: 20, fontWeight: 800,
                    letterSpacing: '-0.02em', fontFamily: 'Poppins, sans-serif',
                  }}>
                    Recherche Client
                  </h2>
                  <p style={{
                    margin: '3px 0 0', color: 'rgba(255,255,255,0.75)',
                    fontSize: 13, fontWeight: 500, fontFamily: 'Poppins, sans-serif',
                  }}>
                    Trouvez un client par nom, prénom ou date de naissance
                  </p>
                </div>
              </div>

              <button
                className="close-btn"
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  borderRadius: 12, width: 40, height: 40,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <X size={18} color="white" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '28px 32px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Nom */}
              <div>
                <label style={labelStyle}>Nom de famille</label>
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="MAKHLOUF"
                  style={inputStyle('nom')}
                  onFocus={() => setFocused('nom')}
                  onBlur={() => setFocused('')}
                />
              </div>

              {/* Prénom */}
              <div>
                <label style={labelStyle}>Prénom</label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Karima"
                  style={inputStyle('prenom')}
                  onFocus={() => setFocused('prenom')}
                  onBlur={() => setFocused('')}
                />
              </div>
            </div>

            {/* Date */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={11} />
                  Date de naissance
                </span>
              </label>
              <input
                type="date"
                name="date_naissance"
                value={form.date_naissance}
                onChange={handleChange}
                style={inputStyle('date_naissance')}
                onFocus={() => setFocused('date_naissance')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Bouton rechercher */}
            <button
              type="submit"
              disabled={loading}
              className="search-btn"
              style={{
                width: '100%', padding: '14px',
                borderRadius: 14, border: 'none',
                background: loading
                  ? '#e2e8f0'
                  : 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                color: loading ? '#94a3b8' : 'white',
                fontWeight: 700, fontSize: 15,
                fontFamily: 'Poppins, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.25s ease',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(34,197,94,0.25)',
                letterSpacing: '0.01em',
              }}
            >
              {loading
                ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Recherche en cours...</>
                : <><Search size={18} strokeWidth={2.5} /> Lancer la recherche</>
              }
            </button>
          </form>

          {/* Results */}
          {results && results.length > 0 && (
            <div style={{
              borderTop: '1px solid #f1f5f9',
              padding: '0 32px 28px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 14, paddingTop: 4,
              }}>
                <span style={{
                  background: '#dcfce7', color: '#15803d',
                  fontSize: 11, fontWeight: 700, padding: '3px 10px',
                  borderRadius: 20, fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {results.length} résultat{results.length > 1 ? 's' : ''}
                </span>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.map((client, i) => (
                  <button
                    key={client.id}
                    className="result-card"
                    onClick={() => onClose(client)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: '2px solid #f1f5f9',
                      background: 'white',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s ease',
                      animationDelay: `${i * 0.06}s`,
                      fontFamily: 'Poppins, sans-serif',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#22c55e';
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#f1f5f9';
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: 'linear-gradient(135deg, #15803d, #22c55e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                    }}>
                      <span style={{ color: 'white', fontWeight: 800, fontSize: 16, fontFamily: 'Poppins, sans-serif' }}>
                        {client.nom?.[0]?.toUpperCase() || <User size={18} color="white" />}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0, fontWeight: 700, fontSize: 15,
                        color: '#1e293b', fontFamily: 'Poppins, sans-serif',
                        letterSpacing: '-0.01em',
                      }}>
                        {client.nom} {client.prenom}
                      </p>
                      <p style={{
                        margin: '2px 0 0', fontSize: 12.5, color: '#64748b',
                        fontFamily: 'Poppins, sans-serif', fontWeight: 500,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {client.email || client.telephone || 'Aucun contact renseigné'}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: '#f0fdf4', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <ChevronRight size={16} color="#22c55e" strokeWidth={2.5} className="arrow-icon" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {results && results.length === 0 && (
            <div style={{
              padding: '8px 32px 32px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18,
                background: '#f8fafc', border: '2px dashed #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <Search size={24} color="#cbd5e1" />
              </div>
              <p style={{
                fontSize: 14, fontWeight: 600, color: '#94a3b8',
                fontFamily: 'Poppins, sans-serif', margin: 0,
              }}>
                Aucun client trouvé
              </p>
              <p style={{
                fontSize: 12, color: '#cbd5e1', fontFamily: 'Poppins, sans-serif',
                margin: '4px 0 0', fontWeight: 500,
              }}>
                Essayez avec d'autres critères
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}