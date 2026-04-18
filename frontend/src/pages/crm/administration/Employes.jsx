// src/pages/crm/administration/Employes.jsx
import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, toggleUserStatut, resetUserPassword, assignRole } from '../../../services/crm/users.js';
import { getRoles } from '../../../services/crm/roles.js';
import { useAuth } from '../../../context/crm/AuthContext.jsx';
import Layout from '../../../components/crm/common/Layout.jsx';

const timeAgo = (date) => {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  if (hrs  < 24) return `il y a ${hrs}h`;
  if (days < 30) return `il y a ${days}j`;
  return new Date(date).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' });
};

const STATUT = {
  actif:    { color: '#15803d', bg: '#dcfce7', dot: '#22c55e', label: 'Actif' },
  inactif:  { color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af', label: 'Inactif' },
  suspendu: { color: '#b45309', bg: '#fef3c7', dot: '#f59e0b', label: 'Suspendu' },
  bloque:   { color: '#dc2626', bg: '#fee2e2', dot: '#ef4444', label: 'Bloqué' },
};

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 99999,
      background: type === 'success' ? '#006837' : '#dc2626',
      color: 'white', padding: '14px 20px', borderRadius: 14,
      fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)', animation: 'toastIn .25s ease',
      fontFamily: "'Poppins', sans-serif", maxWidth: 360,
    }}>
      <span>{type === 'success' ? '✅' : '⚠️'} {msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16, marginLeft: 4, padding: 0 }}>✕</button>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalHead}>
          <div>
            <h2 style={s.modalTitle}>{title}</h2>
            {subtitle && <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Employes() {
  const { hasPermission } = useAuth();

  const [users, setUsers]           = useState([]);
  const [roles, setRoles]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterStatut, setFilter]   = useState('tous');
  const [toast, setToast]           = useState(null);
  const [busy, setBusy]             = useState(false);
  const [resetId, setResetId]       = useState(null);

  // Modals
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit,   setModalEdit]   = useState(null); // user
  const [modalRole,   setModalRole]   = useState(null); // user

  // Formulaires
  const [formCreate, setFormCreate] = useState({ prenom: '', nom: '', email: '', telephone: '', role_id: '' });
  const [formEdit,   setFormEdit]   = useState({ prenom: '', nom: '', email: '', telephone: '' });
  const [newRoleId,  setNewRoleId]  = useState('');

  const toast$ = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    try {
      const [u, r] = await Promise.all([getUsers(), getRoles()]);
      setUsers(u); setRoles(r);
    } catch { toast$('error', 'Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ── Créer ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createUser(formCreate);
      toast$('success', `Compte créé — email envoyé à ${formCreate.email}`);
      setModalCreate(false);
      setFormCreate({ prenom: '', nom: '', email: '', telephone: '', role_id: '' });
      load();
    } catch (err) {
      toast$('error', err.response?.data?.message || 'Erreur création');
    } finally { setBusy(false); }
  };

  // ── Modifier infos ─────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setFormEdit({ prenom: user.prenom, nom: user.nom, email: user.email, telephone: user.telephone || '' });
    setModalEdit(user);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateUser(modalEdit.id, formEdit);
      toast$('success', 'Informations mises à jour ✅');
      setModalEdit(null);
      load();
    } catch (err) {
      toast$('error', err.response?.data?.message || 'Erreur modification');
    } finally { setBusy(false); }
  };

  // ── Changer rôle — BUG CORRIGÉ : appel API réel ───────────────────────────
  const openRole = (user) => {
    setNewRoleId(user.roles?.[0]?.id || '');
    setModalRole(user);
  };

  const handleChangeRole = async (e) => {
    e.preventDefault();
    if (!newRoleId) return toast$('error', 'Sélectionnez un rôle');
    setBusy(true);
    try {
      await assignRole(modalRole.id, newRoleId); // ← appel API réel
      toast$('success', `Rôle mis à jour pour ${modalRole.prenom} ✅`);
      setModalRole(null);
      load();
    } catch (err) {
      toast$('error', err.response?.data?.message || 'Erreur changement de rôle');
    } finally { setBusy(false); }
  };

  // ── Toggle statut ──────────────────────────────────────────────────────────
  const handleToggle = async (user) => {
    const next = user.statut === 'actif' ? 'inactif' : 'actif';
    try {
      await toggleUserStatut(user.id, next);
      toast$('success', `${user.prenom} ${next === 'actif' ? 'activé' : 'désactivé'}`);
      load();
    } catch (err) {
      toast$('error', err.response?.data?.message || 'Erreur');
    }
  };

  // ── Reset password ─────────────────────────────────────────────────────────
  const handleReset = async (user) => {
    if (!window.confirm(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} ?`)) return;
    setResetId(user.id);
    try {
      await resetUserPassword(user.id);
      toast$('success', `Email de reset envoyé à ${user.email}`);
    } catch {
      toast$('error', 'Erreur réinitialisation');
    } finally { setResetId(null); }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(q);
    const matchS = filterStatut === 'tous' || u.statut === filterStatut;
    return matchQ && matchS;
  });

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ width: 36, height: 36, border: '4px solid #dcfce7', borderTopColor: '#006837', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        <p style={{ color: '#64748b', marginTop: 14, fontSize: 14 }}>Chargement...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(-10px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .erow:hover { background: #f8fffe !important; }
        .erow:hover .eact { opacity:1 !important; }
        .abtn:hover { filter: brightness(.92); transform: translateY(-1px); }
        .filtbtn:hover { background: #f1f5f9 !important; }
        .inp:focus { border-color: #006837 !important; box-shadow: 0 0 0 3px rgba(0,104,55,.08); }
      `}</style>

      <Toast msg={toast?.text} type={toast?.type} onClose={() => setToast(null)} />

      <div style={s.page}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Employés</h1>
            <p style={s.sub}>
              <span style={s.badge}>{users.length}</span> compte(s) interne(s)
            </p>
          </div>
          {hasPermission('utilisateurs', 'create') && (
            <button style={s.btnGreen} onClick={() => setModalCreate(true)}>
              + Nouveau compte
            </button>
          )}
        </div>

        {/* ── Stats ── */}
        <div style={s.statsRow}>
          {[
            { label: 'Total',    val: users.length,                             color: '#3b82f6' },
            { label: 'Actifs',   val: users.filter(u=>u.statut==='actif').length, color: '#22c55e' },
            { label: 'Inactifs', val: users.filter(u=>u.statut==='inactif').length, color: '#94a3b8' },
            { label: 'Admins',   val: users.filter(u=>u.est_superadmin).length, color: '#f59e0b' },
          ].map((st, i) => (
            <div key={i} style={s.statCard}>
              <span style={{ fontSize: 24, fontWeight: 800, color: st.color }}>{st.val}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{st.label}</span>
            </div>
          ))}
        </div>

        {/* ── Filtres ── */}
        <div style={s.filtersBar}>
          <div style={s.searchBox}>
            <span style={{ color: '#94a3b8', fontSize: 15 }}>🔍</span>
            <input
              className="inp"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un employé..."
              style={s.searchInput}
            />
            {search && <button onClick={() => setSearch('')} style={s.clearBtn}>✕</button>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['tous','actif','inactif','suspendu'].map(f => (
              <button
                key={f}
                className="filtbtn"
                onClick={() => setFilter(f)}
                style={{ ...s.filtBtn, ...(filterStatut === f ? s.filtBtnOn : {}) }}
              >
                {f === 'tous' ? 'Tous' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div style={s.tableWrap}>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>👥</div>
              <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 15 }}>Aucun employé trouvé</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Employé', 'Contact', 'Rôle', 'Statut', 'Dernière connexion', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => {
                  const cfg  = STATUT[u.statut] || STATUT.inactif;
                  const init = `${u.prenom?.[0]||''}${u.nom?.[0]||''}`.toUpperCase();
                  const ago  = timeAgo(u.dernier_login);
                  return (
                    <tr key={u.id} className="erow" style={{ ...s.tr, animationDelay: `${idx*20}ms` }}>

                      {/* Employé */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 11,
                            background: 'linear-gradient(135deg,#006837,#4CAF50)',
                            color: 'white', fontWeight: 800, fontSize: 13,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {init}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{u.prenom} {u.nom}</div>
                            {u.est_superadmin && (
                              <span style={{ fontSize: 10, background: '#fef3c7', color: '#b45309', padding: '1px 7px', borderRadius: 5, fontWeight: 700 }}>⚡ Super Admin</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={s.td}>
                        <div style={{ fontSize: 13, color: '#374151' }}>{u.email}</div>
                        {u.telephone && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{u.telephone}</div>}
                      </td>

                      {/* Rôle */}
                      <td style={s.td}>
                        {u.roles?.length > 0
                          ? u.roles.map(r => (
                            <span key={r.id} style={{ fontSize: 12, background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: 6, fontWeight: 600, marginRight: 4, display: 'inline-block' }}>
                              {r.nom}
                            </span>
                          ))
                          : <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                        }
                      </td>

                      {/* Statut */}
                      <td style={s.td}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 999, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Connexion */}
                      <td style={s.td}>
                        {ago
                          ? <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{ago}</div>
                              <div style={{ fontSize: 10, color: '#cbd5e1' }}>
                                {new Date(u.dernier_login).toLocaleString('fr-DZ',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
                              </div>
                            </div>
                          : <span style={{ fontSize: 12, color: '#cbd5e1', fontStyle: 'italic' }}>Jamais</span>
                        }
                      </td>

                      {/* Actions */}
                      <td style={s.td}>
                        {!u.est_superadmin && hasPermission('utilisateurs', 'update') && (
                          <div className="eact" style={{ display: 'flex', gap: 5, flexWrap: 'wrap', opacity: .65, transition: 'opacity .2s' }}>
                            <button className="abtn" onClick={() => openEdit(u)} style={s.aBtn('#eff6ff','#2563eb')}>✏️ Modifier</button>
                            <button className="abtn" onClick={() => openRole(u)} style={s.aBtn('#f5f3ff','#7c3aed')}>🔄 Rôle</button>
                            <button className="abtn" onClick={() => handleToggle(u)}
                              style={s.aBtn(u.statut==='actif'?'#fee2e2':'#dcfce7', u.statut==='actif'?'#dc2626':'#16a34a')}>
                              {u.statut==='actif' ? '⏸ Désactiver' : '▶ Activer'}
                            </button>
                            <button className="abtn" onClick={() => handleReset(u)} disabled={resetId===u.id}
                              style={s.aBtn('#fef3c7','#b45309')}>
                              {resetId===u.id ? '...' : '🔑 Reset'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal Créer ── */}
      {modalCreate && (
        <Modal title="Nouveau compte employé" subtitle="Un email avec les identifiants sera envoyé automatiquement" onClose={() => setModalCreate(false)}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Prénom *">
                <input className="inp" value={formCreate.prenom} onChange={e=>setFormCreate({...formCreate,prenom:e.target.value})} required style={s.inp} placeholder="Mohamed" />
              </Field>
              <Field label="Nom *">
                <input className="inp" value={formCreate.nom} onChange={e=>setFormCreate({...formCreate,nom:e.target.value})} required style={s.inp} placeholder="Bensalem" />
              </Field>
            </div>
            <Field label="Email *">
              <input className="inp" type="email" value={formCreate.email} onChange={e=>setFormCreate({...formCreate,email:e.target.value})} required style={s.inp} placeholder="prenom.nom@algtelecom.dz" />
            </Field>
            <Field label="Téléphone">
              <input className="inp" type="tel" value={formCreate.telephone} onChange={e=>setFormCreate({...formCreate,telephone:e.target.value})} style={s.inp} placeholder="0555 XX XX XX" />
            </Field>
            <Field label="Rôle *">
              <select className="inp" value={formCreate.role_id} onChange={e=>setFormCreate({...formCreate,role_id:e.target.value})} required style={s.inp}>
                <option value="">-- Sélectionner --</option>
                {roles.map(r=><option key={r.id} value={r.id}>{r.nom}</option>)}
              </select>
            </Field>
            <div style={s.modalFooter}>
              <button type="button" onClick={() => setModalCreate(false)} style={s.btnGray}>Annuler</button>
              <button type="submit" disabled={busy} style={s.btnGreen}>{busy ? '⏳ Création...' : '✓ Créer le compte'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal Modifier ── */}
      {modalEdit && (
        <Modal title="Modifier l'employé" subtitle={`${modalEdit.prenom} ${modalEdit.nom}`} onClose={() => setModalEdit(null)}>
          <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Prénom *">
                <input className="inp" value={formEdit.prenom} onChange={e=>setFormEdit({...formEdit,prenom:e.target.value})} required style={s.inp} />
              </Field>
              <Field label="Nom *">
                <input className="inp" value={formEdit.nom} onChange={e=>setFormEdit({...formEdit,nom:e.target.value})} required style={s.inp} />
              </Field>
            </div>
            <Field label="Email *">
              <input className="inp" type="email" value={formEdit.email} onChange={e=>setFormEdit({...formEdit,email:e.target.value})} required style={s.inp} />
            </Field>
            <Field label="Téléphone">
              <input className="inp" type="tel" value={formEdit.telephone} onChange={e=>setFormEdit({...formEdit,telephone:e.target.value})} style={s.inp} />
            </Field>
            <div style={s.modalFooter}>
              <button type="button" onClick={() => setModalEdit(null)} style={s.btnGray}>Annuler</button>
              <button type="submit" disabled={busy} style={s.btnGreen}>{busy ? '⏳ Enregistrement...' : '✓ Enregistrer'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal Changer Rôle — BUG CORRIGÉ ── */}
      {modalRole && (
        <Modal title="Changer le rôle" subtitle={`${modalRole.prenom} ${modalRole.nom}`} onClose={() => setModalRole(null)}>
          {/* Rôle actuel */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Rôle actuel</div>
            {modalRole.roles?.length > 0
              ? modalRole.roles.map(r => (
                <span key={r.id} style={{ fontSize: 12, background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                  {r.nom}
                </span>
              ))
              : <span style={{ color: '#94a3b8', fontSize: 13 }}>Aucun rôle assigné</span>
            }
          </div>

          <form onSubmit={handleChangeRole} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Nouveau rôle *">
              <select
                className="inp"
                value={newRoleId}
                onChange={e => setNewRoleId(e.target.value)}
                required
                style={s.inp}
              >
                <option value="">-- Sélectionner un rôle --</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nom}</option>
                ))}
              </select>
            </Field>

            <div style={{ padding: '10px 14px', background: '#fef3c7', borderRadius: 10, fontSize: 13, color: '#92400e' }}>
              ⚠️ Ce changement affecte immédiatement les permissions de l'employé.
            </div>

            <div style={s.modalFooter}>
              <button type="button" onClick={() => setModalRole(null)} style={s.btnGray}>Annuler</button>
              <button
                type="submit"
                disabled={busy || !newRoleId || newRoleId === modalRole.roles?.[0]?.id}
                style={{ ...s.btnGreen, background: (!newRoleId || newRoleId === modalRole.roles?.[0]?.id || busy) ? '#9ca3af' : 'linear-gradient(135deg,#7c3aed,#a78bfa)', cursor: (!newRoleId || busy) ? 'not-allowed' : 'pointer' }}
              >
                {busy ? '⏳ Changement...' : '🔄 Confirmer le changement'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}

// Composant champ de formulaire
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  page:        { padding: '32px', maxWidth: 1200, margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:       { fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' },
  sub:         { fontSize: 14, color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  badge:       { background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  btnGreen:    { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg,#006837,#4CAF50)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(76,175,80,.3)', fontFamily: "'Poppins', sans-serif" },
  btnGray:     { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  statsRow:    { display: 'flex', gap: 12, marginBottom: 22 },
  statCard:    { flex: 1, background: 'white', borderRadius: 14, padding: '16px 12px', border: '1px solid #f0f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 1px 8px rgba(0,0,0,.04)' },
  filtersBar:  { display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' },
  searchBox:   { display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '8px 14px', flex: 1, minWidth: 200, transition: 'border .2s' },
  searchInput: { border: 'none', outline: 'none', fontSize: 14, flex: 1, fontFamily: "'Poppins', sans-serif", color: '#1a1a1a', background: 'transparent' },
  clearBtn:    { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14 },
  filtBtn:     { padding: '7px 15px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#64748b', fontFamily: "'Poppins', sans-serif", transition: 'all .15s' },
  filtBtnOn:   { background: '#0f172a', color: 'white', borderColor: '#0f172a' },
  tableWrap:   { background: 'white', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,.05)', overflow: 'hidden', border: '1px solid #f0f4f8' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '1px solid #f0f4f8', whiteSpace: 'nowrap' },
  tr:          { borderBottom: '1px solid #f8fafc', animation: 'fadeUp .3s ease both', transition: 'background .15s' },
  td:          { padding: '13px 16px', verticalAlign: 'middle' },
  aBtn:        (bg, color) => ({ padding: '5px 10px', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: bg, color, transition: 'filter .15s, transform .15s', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap' }),
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
  modal:       { background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.2)', animation: 'fadeUp .25s ease' },
  modalHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 },
  modalTitle:  { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
  closeBtn:    { width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #f0f4f8', marginTop: 4 },
  inp:         { padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: "'Poppins', sans-serif", color: '#1a1a1a', width: '100%', boxSizing: 'border-box', transition: 'border .2s, box-shadow .2s' },
};