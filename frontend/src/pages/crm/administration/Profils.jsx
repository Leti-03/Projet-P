// src/pages/crm/administration/Profils.jsx
import { useState, useEffect } from 'react';
import {
  getRoles, createRole, deleteRole,
  getRolePermissions, updateRolePermissions
} from '../../../services/crm/roles.js';
import { getUsers } from '../../../services/crm/users.js';
import { useAuth } from '../../../context/crm/AuthContext.jsx';
import Layout from '../../../components/crm/common/Layout.jsx';

const ACTIONS = ['create', 'read', 'update', 'delete'];
const ACTION_META = {
  create: { label: 'Créer',     color: '#10b981', bg: '#ecfdf5' },
  read:   { label: 'Lire',      color: '#3b82f6', bg: '#eff6ff' },
  update: { label: 'Modifier',  color: '#f59e0b', bg: '#fffbeb' },
  delete: { label: 'Supprimer', color: '#ef4444', bg: '#fef2f2' },
};

const BAND_COLORS = ['#006837','#0e7490','#0f172a'];

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 99999,
      background: type === 'success' ? '#006837' : '#dc2626',
      color: 'white', padding: '14px 20px', borderRadius: 14,
      fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,.18)', fontFamily: "'Poppins', sans-serif",
      animation: 'toastIn .25s ease',
    }}>
      {type === 'success' ? '✅' : '⚠️'} {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16, padding: 0 }}>✕</button>
    </div>
  );
}

export default function Profils() {
  const { hasPermission } = useAuth();

  const [roles,   setRoles]   = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [toast,   setToast]   = useState(null);
  const [busy,    setBusy]    = useState(false);

  // Modals
  const [modalCreate, setModalCreate] = useState(false);
  const [modalPerm,   setModalPerm]   = useState(null); // role
  const [matrice,     setMatrice]     = useState([]);
  const [matriceBusy, setMatriceBusy] = useState(false);

  // Formulaire création
  const [form, setForm] = useState({ nom: '', description: '' });

  const toast$ = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    try {
      const [r, u] = await Promise.all([getRoles(), getUsers()]);
      setRoles(r); setUsers(u);
    } catch { toast$('error', 'Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const countByRole = (roleId) => users.filter(u => u.roles?.some(r => r.id === roleId)).length;
  const isProtected = (role) => ['admin','superadmin'].includes(role.nom?.toLowerCase());

  // ── Créer rôle ─────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createRole(form);
      toast$('success', `Profil "${form.nom}" créé ✅`);
      setModalCreate(false);
      setForm({ nom: '', description: '' });
      load();
    } catch (err) {
      toast$('error', err.response?.data?.message || 'Erreur création');
    } finally { setBusy(false); }
  };

  // ── Supprimer rôle ─────────────────────────────────────────────────────────
  const handleDelete = async (role) => {
    if (isProtected(role)) return toast$('error', 'Ce rôle est protégé');
    const n = countByRole(role.id);
    const msg = n > 0
      ? `Ce rôle est assigné à ${n} employé(s). Supprimer quand même ?`
      : `Supprimer le rôle "${role.nom}" ? Action irréversible.`;
    if (!window.confirm(msg)) return;
    try {
      await deleteRole(role.id);
      toast$('success', `Rôle "${role.nom}" supprimé`);
      load();
    } catch (err) {
      toast$('error', err.response?.data?.message || 'Erreur suppression');
    }
  };

  // ── Permissions ────────────────────────────────────────────────────────────
  const openPerm = async (role) => {
    setModalPerm(role);
    setMatriceBusy(true);
    try {
      const data = await getRolePermissions(role.id);
      setMatrice(data);
    } catch { toast$('error', 'Erreur chargement permissions'); }
    finally { setMatriceBusy(false); }
  };

  const togglePerm = (ri, action) => {
    const next = [...matrice];
    const pi = next[ri].permissions.findIndex(p => p.action === action);
    if (pi !== -1) next[ri].permissions[pi].active = !next[ri].permissions[pi].active;
    setMatrice(next);
  };

  const toggleAll = (ri) => {
    const next = [...matrice];
    const allOn = next[ri].permissions.every(p => p.active);
    next[ri].permissions = next[ri].permissions.map(p => ({ ...p, active: !allOn }));
    setMatrice(next);
  };

  const savePerm = async () => {
    const ids = matrice.flatMap(r => r.permissions.filter(p => p.active).map(p => p.permission_id));
    setBusy(true);
    try {
      await updateRolePermissions(modalPerm.id, ids);
      toast$('success', `Permissions de "${modalPerm.nom}" sauvegardées ✅`);
      setModalPerm(null);
    } catch { toast$('error', 'Erreur sauvegarde'); }
    finally { setBusy(false); }
  };

  const filtered = roles.filter(r =>
    r.nom.toLowerCase().includes(search.toLowerCase()) ||
    (r.description||'').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <Layout>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', fontFamily:"'Poppins', sans-serif" }}>
        <div style={{ width:36, height:36, border:'4px solid #dcfce7', borderTopColor:'#006837', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
        <p style={{ color:'#64748b', marginTop:14, fontSize:14 }}>Chargement...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(-10px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .rcard { transition: transform .2s, box-shadow .2s !important; }
        .rcard:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(0,0,0,.1) !important; }
        .prow:hover { background: #f8fffe !important; }
        .inp:focus { border-color: #006837 !important; box-shadow: 0 0 0 3px rgba(0,104,55,.08); }
      `}</style>

      <Toast msg={toast?.text} type={toast?.type} onClose={() => setToast(null)} />

      <div style={s.page}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Profils & Rôles</h1>
            <p style={s.sub}>
              <span style={s.badge}>{roles.length}</span> rôle(s) —
              <span style={{ color:'#94a3b8', marginLeft:6 }}>{users.length} employé(s) au total</span>
            </p>
          </div>
          {hasPermission('roles','create') && (
            <button style={s.btnGreen} onClick={() => setModalCreate(true)}>+ Nouveau profil</button>
          )}
        </div>

        {/* Recherche */}
        <div style={s.searchBox}>
          <span style={{ color:'#94a3b8' }}>🔍</span>
          <input className="inp" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher un profil..." style={{ ...s.inp, border:'none', padding:'0', flex:1, outline:'none' }} />
          {search && <button onClick={()=>setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:14 }}>✕</button>}
        </div>

        {/* Grille des rôles */}
        <div style={s.grid}>
          {filtered.map((role, idx) => {
            const color  = BAND_COLORS[idx % BAND_COLORS.length];
            const count  = countByRole(role.id);
            const prot   = isProtected(role);
            const empList = users.filter(u => u.roles?.some(r => r.id === role.id)).slice(0, 4);

            return (
              <div key={role.id} className="rcard" style={{
                background: 'white', borderRadius: 18,
                boxShadow: '0 2px 12px rgba(0,0,0,.06)',
                border: `1px solid ${prot ? '#fde68a' : '#f0f4f8'}`,
                overflow: 'hidden',
                animation: `slideUp .35s ease ${idx*50}ms both`,
              }}>
                {/* Bande couleur */}
                <div style={{ height: 4, background: color }} />

                <div style={{ padding: 22 }}>
                  {/* Titre + badge protégé */}
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:`${color}18`, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, flexShrink:0 }}>
                        {role.nom[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 3px' }}>{role.nom}</h3>
                        <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.4 }}>
                          {role.description || 'Aucune description'}
                        </p>
                      </div>
                    </div>
                    {prot && (
                      <span style={{ fontSize:10, background:'#fef3c7', color:'#b45309', padding:'2px 8px', borderRadius:999, fontWeight:700, flexShrink:0, marginLeft:8 }}>🔒 Protégé</span>
                    )}
                  </div>

                  {/* Employés */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, padding:'8px 12px', background:'#f8fafc', borderRadius:10 }}>
                    <div style={{ display:'flex' }}>
                      {empList.map((u,i) => (
                        <div key={u.id} title={`${u.prenom} ${u.nom}`} style={{
                          width:26, height:26, borderRadius:'50%', background:color, color:'white',
                          fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center',
                          border:'2px solid white', marginLeft: i>0 ? -8 : 0, position:'relative', zIndex:4-i,
                        }}>
                          {u.prenom?.[0]}{u.nom?.[0]}
                        </div>
                      ))}
                      {count > 4 && (
                        <div style={{ width:26, height:26, borderRadius:'50%', background:'#e2e8f0', color:'#64748b', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white', marginLeft:-8 }}>
                          +{count-4}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize:12, color: count>0 ? color : '#94a3b8', fontWeight:700 }}>
                      {count === 0 ? 'Aucun employé' : `${count} employé${count>1?'s':''}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    {hasPermission('roles','read') && (
                      <button
                        onClick={() => openPerm(role)}
                        style={{ flex:1, padding:'8px 0', border:`1.5px solid ${color}30`, background:`${color}0f`, color, borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins', sans-serif", transition:'filter .15s' }}
                        onMouseEnter={e=>e.currentTarget.style.filter='brightness(.9)'}
                        onMouseLeave={e=>e.currentTarget.style.filter='none'}
                      >
                        ⚙️ Permissions
                      </button>
                    )}
                    {hasPermission('roles','delete') && !prot && (
                      <button
                        onClick={() => handleDelete(role)}
                        style={{ padding:'8px 14px', border:'1.5px solid #fecaca', background:'#fee2e2', color:'#dc2626', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins', sans-serif" }}
                        onMouseEnter={e=>e.currentTarget.style.filter='brightness(.92)'}
                        onMouseLeave={e=>e.currentTarget.style.filter='none'}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carte ajouter */}
          {hasPermission('roles','create') && (
            <div
              onClick={() => setModalCreate(true)}
              style={{ background:'#fafbfc', borderRadius:18, border:'2px dashed #e2e8f0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, minHeight:200, cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#4CAF50'; e.currentTarget.style.background='#f0fdf4';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='#fafbfc';}}
            >
              <div style={{ width:44, height:44, borderRadius:13, background:'#e8f5e9', color:'#006837', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700 }}>+</div>
              <span style={{ fontSize:13, fontWeight:700, color:'#64748b' }}>Nouveau profil</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Créer ── */}
      {modalCreate && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget && setModalCreate(false)}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <div>
                <h2 style={s.modalTitle}>Créer un profil</h2>
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Définissez le nom et la description du nouveau rôle</p>
              </div>
              <button onClick={()=>setModalCreate(false)} style={s.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={s.field}>
                <label style={s.label}>Nom du profil *</label>
                <input className="inp" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}
                  placeholder="Ex: Technicien, Commercial, Superviseur..."
                  required style={s.inp} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea className="inp" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  placeholder="Décrivez les responsabilités de ce profil..."
                  style={{ ...s.inp, minHeight:80, resize:'vertical' }} />
              </div>
              <div style={s.modalFooter}>
                <button type="button" onClick={()=>setModalCreate(false)} style={s.btnGray}>Annuler</button>
                <button type="submit" disabled={busy} style={s.btnGreen}>{busy ? '⏳ Création...' : '✓ Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Permissions ── */}
      {modalPerm && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget && setModalPerm(null)}>
          <div style={{ ...s.modal, maxWidth:700 }}>
            <div style={s.modalHead}>
              <div>
                <h2 style={s.modalTitle}>Permissions — {modalPerm.nom}</h2>
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Cochez les actions autorisées pour ce profil</p>
              </div>
              <button onClick={()=>setModalPerm(null)} style={s.closeBtn}>✕</button>
            </div>

            {matriceBusy ? (
              <div style={{ textAlign:'center', padding:'48px 0', color:'#94a3b8' }}>
                <div style={{ width:32, height:32, border:'4px solid #e2e8f0', borderTopColor:'#006837', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }} />
                Chargement des permissions...
              </div>
            ) : (
              <>
                {/* Résumé badges */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:18 }}>
                  {matrice.map((r,ri) => {
                    const on = r.permissions.filter(p=>p.active).length;
                    return (
                      <span key={ri} style={{ padding:'3px 10px', borderRadius:999, background: on>0?'#dcfce7':'#f1f5f9', color: on>0?'#15803d':'#94a3b8', fontSize:12, fontWeight:700 }}>
                        {r.ressource_nom}: {on}/{r.permissions.length}
                      </span>
                    );
                  })}
                </div>

                {/* Tableau permissions */}
                <div style={{ maxHeight:'52vh', overflowY:'auto', borderRadius:12, border:'1px solid #f0f4f8' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ background:'#f8fafc', position:'sticky', top:0, zIndex:1 }}>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.6px', borderBottom:'1px solid #f0f4f8', width:'30%' }}>Ressource</th>
                        {ACTIONS.map(a => (
                          <th key={a} style={{ padding:'11px 16px', textAlign:'center', fontSize:11, fontWeight:700, color:ACTION_META[a].color, textTransform:'uppercase', letterSpacing:'.5px', borderBottom:'1px solid #f0f4f8' }}>
                            {ACTION_META[a].label}
                          </th>
                        ))}
                        <th style={{ padding:'11px 16px', textAlign:'center', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', borderBottom:'1px solid #f0f4f8' }}>Tout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrice.map((ressource, ri) => {
                        const allOn = ressource.permissions.length > 0 && ressource.permissions.every(p=>p.active);
                        return (
                          <tr key={ressource.ressource_id} className="prow" style={{ borderBottom:'1px solid #f8fafc', transition:'background .15s' }}>
                            <td style={{ padding:'12px 16px', fontWeight:700, fontSize:13, color:'#374151', textTransform:'capitalize' }}>
                              {ressource.ressource_nom}
                            </td>
                            {ACTIONS.map(action => {
                              const perm = ressource.permissions.find(p=>p.action===action);
                              return (
                                <td key={action} style={{ padding:'12px 16px', textAlign:'center' }}>
                                  {perm ? (
                                    <label style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer', width:28, height:28, borderRadius:8, background: perm.active ? ACTION_META[action].bg : '#f8fafc', border:`1.5px solid ${perm.active ? ACTION_META[action].color+'40' : '#e2e8f0'}`, transition:'all .15s' }}>
                                      <input
                                        type="checkbox"
                                        checked={perm.active}
                                        onChange={() => togglePerm(ri, action)}
                                        style={{ display:'none' }}
                                      />
                                      {perm.active && (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                          <path d="M2 6L5 9L10 3" stroke={ACTION_META[action].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      )}
                                    </label>
                                  ) : (
                                    <div style={{ width:28, height:28, borderRadius:8, background:'#f1f5f9', border:'1.5px solid #e2e8f0', margin:'auto', cursor:'not-allowed' }} title="Non configuré en BDD" />
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ padding:'12px 16px', textAlign:'center' }}>
                              <button
                                onClick={() => toggleAll(ri)}
                                style={{ padding:'4px 10px', borderRadius:7, border:`1px solid ${allOn?'#fecaca':'#bbf7d0'}`, background: allOn?'#fee2e2':'#dcfce7', fontSize:11, fontWeight:700, cursor:'pointer', color: allOn?'#dc2626':'#15803d', fontFamily:"'Poppins', sans-serif" }}
                              >
                                {allOn ? 'Aucun' : 'Tout'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={s.modalFooter}>
                  <button onClick={()=>setModalPerm(null)} style={s.btnGray}>Annuler</button>
                  <button onClick={savePerm} disabled={busy} style={s.btnGreen}>
                    {busy ? '⏳ Sauvegarde...' : '✓ Sauvegarder les permissions'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

const s = {
  page:        { padding:'32px', maxWidth:1200, margin:'0 auto', fontFamily:"'Poppins', sans-serif" },
  header:      { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 },
  title:       { fontSize:26, fontWeight:800, color:'#0f172a', margin:'0 0 6px' },
  sub:         { fontSize:14, color:'#64748b', margin:0, display:'flex', alignItems:'center', gap:6 },
  badge:       { background:'#dcfce7', color:'#15803d', padding:'2px 10px', borderRadius:999, fontSize:13, fontWeight:700 },
  btnGreen:    { display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', background:'linear-gradient(135deg,#006837,#4CAF50)', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(76,175,80,.3)', fontFamily:"'Poppins', sans-serif" },
  btnGray:     { padding:'10px 20px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:"'Poppins', sans-serif" },
  searchBox:   { display:'flex', alignItems:'center', gap:8, background:'white', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'9px 14px', marginBottom:20, maxWidth:360 },
  grid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:18 },
  overlay:     { position:'fixed', inset:0, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:20 },
  modal:       { background:'white', borderRadius:20, padding:32, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 30px 80px rgba(0,0,0,.2)', animation:'slideUp .25s ease' },
  modalHead:   { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 },
  modalTitle:  { fontSize:20, fontWeight:800, color:'#0f172a', margin:'0 0 4px' },
  closeBtn:    { width:32, height:32, borderRadius:8, background:'#f1f5f9', border:'none', cursor:'pointer', fontSize:14, color:'#64748b', display:'flex', alignItems:'center', justifyContent:'center' },
  modalFooter: { display:'flex', gap:10, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid #f0f4f8', marginTop:16 },
  field:       { display:'flex', flexDirection:'column', gap:6 },
  label:       { fontSize:11, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'.5px' },
  inp:         { padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, outline:'none', fontFamily:"'Poppins', sans-serif", color:'#1a1a1a', width:'100%', boxSizing:'border-box', transition:'border .2s, box-shadow .2s' },
};