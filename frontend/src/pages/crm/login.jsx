// src/pages/crm/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/crm/AuthContext.jsx';

export default function LoginCRM() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/crm/dashboard');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Fond animé */}
      <div style={s.bgGrid} />
      <div style={s.bgBlob1} />
      <div style={s.bgBlob2} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoCircle}>
            <span style={s.logoText}>AT</span>
          </div>
          <div style={s.logoPulse} />
        </div>

        <h1 style={s.title}>Espace CRM</h1>
        <p style={s.subtitle}>Algérie Télécom — Accès interne</p>

        <form onSubmit={handleSubmit} style={s.form}>
          {error && (
            <div style={s.errorBox}>
              <span style={s.errorIcon}>⚠</span> {error}
            </div>
          )}

          {/* Email */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Adresse email</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>✉</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@algérie-télécom.dz"
                required
                style={s.input}
                onFocus={e => e.target.parentElement.style.borderColor = '#4CAF50'}
                onBlur={e  => e.target.parentElement.style.borderColor = '#E8EDF2'}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Mot de passe</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>🔒</span>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{ ...s.input, paddingRight: '44px' }}
                onFocus={e => e.target.parentElement.style.borderColor = '#4CAF50'}
                onBlur={e  => e.target.parentElement.style.borderColor = '#E8EDF2'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={s.eyeBtn}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}>
            {loading ? (
              <span style={s.spinner} />
            ) : (
              <>Se connecter <span style={{ marginLeft: 6 }}>→</span></>
            )}
          </button>
        </form>

        <p style={s.footer}>
          🔒 Accès réservé au personnel Algérie Télécom
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a2818 100%)',
    padding: '20px', position: 'relative', overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
  },
  bgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(76,175,80,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.05) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
  },
  bgBlob1: {
    position: 'absolute', top: '-20%', right: '-10%',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%)',
    animation: 'float 8s ease-in-out infinite',
  },
  bgBlob2: {
    position: 'absolute', bottom: '-20%', left: '-10%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,104,55,0.15) 0%, transparent 70%)',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  card: {
    position: 'relative', zIndex: 10,
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '48px 40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
    animation: 'fadeUp 0.6s ease-out',
    textAlign: 'center',
  },
  logoWrap: {
    position: 'relative', width: '72px', height: '72px',
    margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoCircle: {
    width: '72px', height: '72px', borderRadius: '20px',
    background: 'linear-gradient(135deg, #006837, #4CAF50)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(76,175,80,0.4)',
    position: 'relative', zIndex: 1,
  },
  logoText: { color: 'white', fontSize: '26px', fontWeight: '800', letterSpacing: '-1px' },
  logoPulse: {
    position: 'absolute', inset: '-8px', borderRadius: '28px',
    border: '2px solid rgba(76,175,80,0.3)',
    animation: 'pulse 2s ease-out infinite',
  },
  title: { fontSize: '26px', fontWeight: '800', color: '#0d1b2a', margin: '0 0 6px' },
  subtitle: { fontSize: '13px', color: '#8a9bb0', margin: '0 0 32px', fontWeight: '500' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' },
  errorBox: {
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: '12px', padding: '12px 16px',
    color: '#DC2626', fontSize: '13px', fontWeight: '500',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  errorIcon: { fontSize: '16px' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.6px' },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '2px solid #E8EDF2', borderRadius: '12px',
    background: '#FAFBFC', transition: 'border-color 0.2s, box-shadow 0.2s',
    position: 'relative',
  },
  inputIcon: { padding: '0 0 0 14px', fontSize: '16px', flexShrink: 0 },
  input: {
    flex: 1, border: 'none', background: 'transparent',
    padding: '13px 14px', fontSize: '14px', color: '#1a1a1a',
    outline: 'none', fontFamily: "'Poppins', sans-serif",
  },
  eyeBtn: {
    position: 'absolute', right: '12px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '16px', padding: '4px',
  },
  btn: {
    padding: '15px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #006837, #4CAF50)',
    color: 'white', border: 'none',
    fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginTop: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(76,175,80,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    fontFamily: "'Poppins', sans-serif",
  },
  spinner: {
    width: '20px', height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  footer: { marginTop: '24px', fontSize: '12px', color: '#a0aec0', fontWeight: '500' },
};
