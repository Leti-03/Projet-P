// src/pages/crm/administration/Parametres.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/crm/AuthContext.jsx';
import Layout from '../../../components/crm/common/Layout.jsx';
import api from '../../../services/crm/api.js';

// ── Icônes SVG inline ─────────────────────────────────────────
const IconUser   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconLock   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconServer = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="5" rx="1"/><rect x="2" y="10" width="20" height="5" rx="1"/><rect x="2" y="17" width="20" height="5" rx="1"/><circle cx="6" cy="5.5" r="1" fill="currentColor"/><circle cx="6" cy="12.5" r="1" fill="currentColor"/><circle cx="6" cy="19.5" r="1" fill="currentColor"/></svg>;
const IconEye = ({ off }) => off
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

// ── Toast ────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  const isErr = msg.type === 'error';
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: isErr ? '#fef2f2' : '#f0fdf4',
      border: `1px solid ${isErr ? '#fecaca' : '#bbf7d0'}`,
      color: isErr ? '#dc2626' : '#15803d',
      borderRadius: 14, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      fontSize: 14, fontWeight: 600, maxWidth: 360,
      animation: 'slideInRight 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <span style={{ fontSize: 20 }}>{isErr ? '⚠️' : '✅'}</span>
      <span style={{ flex: 1 }}>{msg.text}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'inherit', padding: 2 }}>✕</button>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────
function Section({ icon, title, subtitle, children, accent = '#4CAF50' }) {
  return (
    <div style={s.section}>
      <div style={s.sectionHead}>
        <div style={{ ...s.sectionIcon, background: `${accent}15`, color: accent }}>{icon}</div>
        <div>
          <div style={s.sectionTitle}>{title}</div>
          <div style={s.sectionSub}>{subtitle}</div>
        </div>
      </div>
      <div style={s.sectionBody}>{children}</div>
    </div>
  );
}

// ── Champ input ───────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, disabled, hint, rightEl, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={{
        ...s.inputWrap,
        borderColor: focused ? '#4CAF50' : disabled ? '#f1f5f9' : '#e2e8f0',
        boxShadow: focused ? '0 0 0 3px rgba(76,175,80,0.12)' : 'none',
        background: disabled ? '#f8fafc' : 'white',
      }}>
        <input
          type={type} value={value} onChange={onChange} disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...s.input, color: disabled ? '#94a3b8' : '#1a1a1a', paddingRight: rightEl ? '44px' : '14px' }}
        />
        {rightEl && (
          <button type="button" style={s.rightElBtn}>{rightEl}</button>
        )}
      </div>
      {hint && <span style={s.hint}>{hint}</span>}
    </div>
  );
}

export default function Parametres() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');

  // Profil
  const [profil, setProfil]             = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [profilLoading, setProfilLoading] = useState(false);

  // MDP
  const [mdp, setMdp]                   = useState({ ancien: '', nouveau: '', confirm: '' });
  const [showMdp, setShowMdp]           = useState({ ancien: false, nouveau: false, confirm: false });
  const [mdpLoading, setMdpLoading]     = useState(false);

  // Système
  const [sysInfo, setSysInfo]     = useState(null);
  const [sysLoading, setSysLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const notify = (type, text) => setToast({ type, text });

  useEffect(() => {
    if (user) setProfil({ nom: user.nom || '', prenom: user.prenom || '', email: user.email || '', telephone: user.telephone || '' });
  }, [user]);

  useEffect(() => {
    if (activeTab === 'systeme' && !user?.est_superadmin) {
      setActiveTab('profil');
    }
  }, [activeTab, user]);

  useEffect(() => {
    api.get('/health')
      .then(({ data }) => setSysInfo(data))
      .catch(() => setSysInfo({ status: 'Inconnu', timestamp: null }))
      .finally(() => setSysLoading(false));
  }, []);

  const handleSaveProfil = async (e) => {
    e.preventDefault();
    if (!profil.nom.trim() || !profil.prenom.trim()) return notify('error', 'Nom et prénom obligatoires');
    setProfilLoading(true);
    try {
      await api.put(`/users/${user.id}`, { nom: profil.nom, prenom: profil.prenom, telephone: profil.telephone });
      notify('success', 'Profil mis à jour avec succès');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setProfilLoading(false);
    }
  };

  const handleSaveMdp = async (e) => {
    e.preventDefault();
    if (!mdp.ancien || !mdp.nouveau || !mdp.confirm) return notify('error', 'Tous les champs sont obligatoires');
    if (mdp.nouveau.length < 8) return notify('error', 'Le mot de passe doit faire au moins 8 caractères');
    if (mdp.nouveau !== mdp.confirm) return notify('error', 'Les mots de passe ne correspondent pas');
    setMdpLoading(true);
    try {
      await api.put(`/users/${user.id}/password`, { ancien_mot_de_passe: mdp.ancien, nouveau_mot_de_passe: mdp.nouveau });
      setMdp({ ancien: '', nouveau: '', confirm: '' });
      notify('success', 'Mot de passe changé avec succès');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Mot de passe actuel incorrect');
    } finally {
      setMdpLoading(false);
    }
  };

  const force = (() => {
    const p = mdp.nouveau;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)          score++;
    if (p.length >= 12)         score++;
    if (/[A-Z]/.test(p))        score++;
    if (/[0-9]/.test(p))        score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();
  const forceLabel = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][force];
  const forceColor = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#15803d'][force];

  const tabs = [
    { id: 'profil',  icon: <IconUser />,   label: 'Mon profil' },
    { id: 'securite', icon: <IconLock />,  label: 'Sécurité' },
    ...(user?.est_superadmin ? [{ id: 'systeme',  icon: <IconServer />, label: 'Système' }] : []),
  ];

  return (
    <Layout>
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .tab-btn:hover { background: #f8fafc !important; }
        .save-btn:hover:not(:disabled) { filter: brightness(0.92); transform: translateY(-1px); }
        .save-btn:active { transform: translateY(0) !important; }
      `}</style>

      <Toast msg={toast} onClose={() => setToast(null)} />

      <div style={s.page}>
        {/* ── Header ── */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={s.bigAvatar}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div>
              <h1 style={s.title}>Paramètres</h1>
              <p style={s.subtitle}>{user?.prenom} {user?.nom} · {user?.email}</p>
            </div>
          </div>
          <div>
            {user?.est_superadmin ? (
              <span style={s.superBadge}>⚡ Super Admin</span>
            ) : (
              <span style={{ ...s.superBadge, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                {user?.roles?.[0]?.nom || 'Non assigné'}
              </span>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={s.tabsBar}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className="tab-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...s.tabBtn,
                ...(activeTab === tab.id ? s.tabBtnActive : {}),
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Contenu ── */}
        <div style={{ animation: 'fadeIn 0.3s ease' }}>

          {/* PROFIL */}
          {activeTab === 'profil' && (
            <Section icon={<IconUser />} title="Informations personnelles" subtitle="Modifiez vos informations de compte">
              <form onSubmit={handleSaveProfil} style={s.form}>
                <div style={s.row}>
                  <Field label="Prénom *" value={profil.prenom} onChange={e => setProfil({ ...profil, prenom: e.target.value })} placeholder="Mohamed" />
                  <Field label="Nom *" value={profil.nom} onChange={e => setProfil({ ...profil, nom: e.target.value })} placeholder="Bensalem" />
                </div>
                <Field label="Email" value={profil.email} disabled hint="L'adresse email ne peut pas être modifiée" />
                <Field label="Téléphone" value={profil.telephone} onChange={e => setProfil({ ...profil, telephone: e.target.value })} placeholder="0555 XX XX XX" />
                <div style={s.row}>
                  <Field label="Rôle" value={user?.roles?.[0]?.nom || 'Non assigné'} disabled />
                  <Field label="Statut" value={user?.est_actif ? 'Actif' : 'Inactif'} disabled />
                </div>
                <div style={s.formFooter}>
                  <button type="submit" disabled={profilLoading} className="save-btn" style={{ ...s.btnPrimary, transition: 'all 0.2s' }}>
                    {profilLoading ? '⏳ Enregistrement...' : '✓ Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            </Section>
          )}

          {/* SÉCURITÉ */}
          {activeTab === 'securite' && (
            <Section icon={<IconLock />} title="Changer le mot de passe" subtitle="Utilisez un mot de passe fort et unique" accent="#6366f1">
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '14px 16px', borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 600 }}>
                Pour la sécurité de votre compte, utilisez un mot de passe unique que vous n'utilisez nulle part ailleurs.
              </div>
              <form onSubmit={handleSaveMdp} style={s.form}>
                <Field
                  label="Mot de passe actuel"
                  type={showMdp.ancien ? 'text' : 'password'}
                  value={mdp.ancien}
                  onChange={e => setMdp({ ...mdp, ancien: e.target.value })}
                  placeholder="••••••••"
                  rightEl={<span onClick={() => setShowMdp(p => ({ ...p, ancien: !p.ancien }))} style={{ cursor: 'pointer', color: '#94a3b8' }}><IconEye off={showMdp.ancien} /></span>}
                />
                <Field
                  label="Nouveau mot de passe"
                  type={showMdp.nouveau ? 'text' : 'password'}
                  value={mdp.nouveau}
                  onChange={e => setMdp({ ...mdp, nouveau: e.target.value })}
                  placeholder="••••••••"
                  rightEl={<span onClick={() => setShowMdp(p => ({ ...p, nouveau: !p.nouveau }))} style={{ cursor: 'pointer', color: '#94a3b8' }}><IconEye off={showMdp.nouveau} /></span>}
                />

                {/* Barre de force */}
                {mdp.nouveau && (
                  <div>
                    <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= force ? forceColor : '#e2e8f0', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: forceColor }}>{forceLabel}</div>
                  </div>
                )}

                <Field
                  label="Confirmer le nouveau mot de passe"
                  type={showMdp.confirm ? 'text' : 'password'}
                  value={mdp.confirm}
                  onChange={e => setMdp({ ...mdp, confirm: e.target.value })}
                  placeholder="••••••••"
                  rightEl={<span onClick={() => setShowMdp(p => ({ ...p, confirm: !p.confirm }))} style={{ cursor: 'pointer', color: '#94a3b8' }}><IconEye off={showMdp.confirm} /></span>}
                />

                {mdp.confirm && mdp.nouveau && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: mdp.nouveau === mdp.confirm ? '#15803d' : '#dc2626' }}>
                    {mdp.nouveau === mdp.confirm ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                  </div>
                )}

                {/* Exigences */}
                <div style={s.requirements}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>Exigences :</div>
                  {[
                    { ok: mdp.nouveau.length >= 8,   text: 'Au moins 8 caractères' },
                    { ok: /[A-Z]/.test(mdp.nouveau), text: 'Au moins une majuscule' },
                    { ok: /[0-9]/.test(mdp.nouveau), text: 'Au moins un chiffre' },
                  ].map((r, i) => (
                    <div key={i} style={{ fontSize: 12, color: r.ok ? '#15803d' : '#94a3b8', fontWeight: 600, marginBottom: 4, transition: 'color 0.2s' }}>
                      {r.ok ? '✓' : '○'} {r.text}
                    </div>
                  ))}
                </div>

                <div style={s.formFooter}>
                  <button type="submit" disabled={mdpLoading} className="save-btn" style={{ ...s.btnPrimary, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', transition: 'all 0.2s' }}>
                    {mdpLoading ? '⏳ Modification...' : '🔐 Changer le mot de passe'}
                  </button>
                </div>
              </form>
            </Section>
          )}

          {/* SYSTÈME */}
          {activeTab === 'systeme' && (
            <Section icon={<IconServer />} title="Informations système" subtitle="État du serveur et de la base de données" accent="#f59e0b">
              {sysLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Chargement...</div>
              ) : (
                <div style={s.sysGrid}>
                  {[
                    { label: 'Statut API',       value: sysInfo?.status || 'Inconnu', ok: sysInfo?.status === 'OK', isStatus: true },
                    { label: 'Version',           value: 'v1.0.0',                   ok: true },
                    { label: 'Base de données',   value: 'Supabase PostgreSQL',       ok: true },
                    { label: 'Environnement',     value: 'Production',               ok: true },
                    { label: 'Dernière synchro',  value: sysInfo?.timestamp ? new Date(sysInfo.timestamp).toLocaleString('fr-DZ') : '—', ok: true },
                    { label: 'Votre rôle',        value: user?.est_superadmin ? 'Super Admin' : (user?.roles?.[0]?.nom || '—'), ok: true },
                  ].map((item, i) => (
                    <div key={i} style={s.sysRow}>
                      <span style={s.sysLabel}>{item.label}</span>
                      <span style={{ ...s.sysValue, color: item.isStatus ? (item.ok ? '#15803d' : '#dc2626') : '#0f172a' }}>
                        {item.isStatus && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.ok ? '#22c55e' : '#ef4444', display: 'inline-block', marginRight: 7 }} />
                        )}
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}
        </div>
      </div>
    </Layout>
  );
}

const s = {
  page: { padding: '32px', maxWidth: 800, margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  bigAvatar: { width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #006837, #4CAF50)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800 },
  title: { fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
  subtitle: { fontSize: 13, color: '#64748b', margin: 0 },
  superBadge: { padding: '7px 16px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  tabsBar: { display: 'flex', gap: 6, marginBottom: 24, background: '#f1f5f9', padding: 5, borderRadius: 14, width: 'fit-content' },
  tabBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b', background: 'transparent', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif" },
  tabBtnActive: { background: 'white', color: '#0f172a', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  section: { background: 'white', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f0f4f8' },
  sectionHead: { display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', borderBottom: '1px solid #f0f4f8' },
  sectionIcon: { width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionTitle: { fontWeight: 700, fontSize: 16, color: '#0f172a' },
  sectionSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  sectionBody: { padding: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputWrap: { display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, background: 'white', transition: 'all 0.2s', position: 'relative' },
  input: { flex: 1, border: 'none', background: 'transparent', padding: '11px 14px', fontSize: 14, outline: 'none', fontFamily: "'Poppins', sans-serif", width: '100%' },
  rightElBtn: { position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  hint: { fontSize: 12, color: '#94a3b8' },
  formFooter: { display: 'flex', justifyContent: 'flex-end', paddingTop: 8 },
  btnPrimary: { padding: '12px 24px', background: 'linear-gradient(135deg, #006837, #4CAF50)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", boxShadow: '0 4px 14px rgba(76,175,80,0.3)' },
  requirements: { background: '#f8fafc', border: '1px solid #f0f4f8', borderRadius: 10, padding: '14px 16px' },
  sysGrid: { display: 'flex', flexDirection: 'column', gap: 0 },
  sysRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f8fafc' },
  sysLabel: { fontSize: 14, color: '#64748b', fontWeight: 500 },
  sysValue: { fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center' },
};
