// src/pages/crm/administration/Profils.jsx
import { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole, getRolePermissions, updateRolePermissions } from '../../../services/crm/roles.js';
import { getUsers } from '../../../services/crm/users.js';
import { useAuth } from '../../../context/crm/AuthContext.jsx';
import Layout from '../../../components/crm/common/Layout.jsx';

const ROLE_COLORS = [
  '#4CAF50', '#3b82f6', '#7c3aed', '#f59e0b',
  '#be185d', '#0e7490', '#dc2626', '#0891b2',
];

export default function Profils() {
  const [roles, setRoles]                     = useState([]);
  const [users, setUsers]                     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermModal, setShowPermModal]     = useState(false);
  const [selectedRole, setSelectedRole]       = useState(null);
  const [matrice, setMatrice]                 = useState([]);
  const [matriceLoading, setMatriceLoading]   = useState(false);
  const [saveLoading, setSaveLoading]         = useState(false);
  const [form, setForm]                       = useState({ nom: '', description: '' });
  const [createLoading, setCreateLoading]     = useState(false);
  const [message, setMessage]                 = useState(null);
  const [search, setSearch]                   = useState('');
  const { hasPermission } = useAuth();

  useEffect(() => { chargerDonnees(); }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const chargerDonnees = async () => {
    try {
      const [rolesData, usersData] = await Promise.all([getRoles(), getUsers()]);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Compte le nombre d'employés ayant ce rôle
  const countEmployesByRole = (roleId) => {
    return users.filter(u =>
      u.roles?.some(r => r.id === roleId)
    ).length;
  };

  const isAdminRole = (role) =>
    role.nom?.toLowerCase() === 'admin' ||
    role.nom?.toLowerCase() === 'superadmin' ||
    role.est_superadmin;

  const ouvrirPermissions = async (role) => {
    setSelectedRole(role);
    setMatriceLoading(true);
    setShowPermModal(true);
    try {
      const data = await getRolePermissions(role.id);
      setMatrice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatriceLoading(false);
    }
  };

  const togglePermission = (ri, pi) => {
    const next = [...matrice];
    next[ri].permissions[pi].active = !next[ri].permissions[pi].active;
    setMatrice(next);
  };

  const toggleAllRessource = (ri) => {
    const next = [...matrice];
    const allActive = next[ri].permissions.every(p => p.active);
    next[ri].permissions = next[ri].permissions.map(p => ({ ...p, active: !allActive }));
    setMatrice(next);
  };

  const sauvegarderPermissions = async () => {
    const activeIds = matrice.flatMap(r => r.permissions.filter(p => p.active).map(p => p.permission_id));
    setSaveLoading(true);
    try {
      await updateRolePermissions(selectedRole.id, activeIds);
      setMessage({ type: 'success', text: `Permissions de "${selectedRole.nom}" mises à jour ✅` });
      setShowPermModal(false);
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await createRole(form);
      setMessage({ type: 'success', text: `Rôle "${form.nom}" créé ✅` });
      setShowCreateModal(false);
      setForm({ nom: '', description: '' });
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (role) => {
    if (isAdminRole(role)) {
      setMessage({ type: 'error', text: 'Le rôle Admin ne peut pas être supprimé.' });
      return;
    }
    const count = countEmployesByRole(role.id);
    if (count > 0) {
      if (!window.confirm(`Ce rôle est assigné à ${count} employé(s). Supprimer quand même ?`)) return;
    } else {
      if (!window.confirm(`Supprimer le rôle "${role.nom}" ? Cette action est irréversible.`)) return;
    }
    try {
      await deleteRole(role.id);
      setMessage({ type: 'success', text: `Rôle "${role.nom}" supprimé` });
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const filteredRoles = roles.filter(r =>
    r.nom.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #e8f5e9', borderTopColor: '#4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', marginTop: 12, fontFamily: "'Poppins', sans-serif" }}>Chargement des profils...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <Layout>
      <div style={s.page}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .role-card:hover   { transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
        .perm-row:hover    { background: #f8fffe !important; }
        .check-all:hover   { background: #f1f5f9 !important; }
        .card-btn:hover    { filter: brightness(0.9); }
      `}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Gestion des Profils</h1>
          <p style={s.subtitle}>
            <span style={s.countBadge}>{roles.length}</span> rôle(s) —
            <span style={{ marginLeft: 6, color: '#94a3b8' }}>{users.length} employé(s) au total</span>
          </p>
        </div>
        {hasPermission('roles', 'create') && (
          <button style={s.btnPrimary} onClick={() => setShowCreateModal(true)}>
            <span style={{ fontSize: 18 }}>+</span> Nouveau profil
          </button>
        )}
      </div>

      {/* ── Message ── */}
      {message && (
        <div style={{ ...s.alert, ...(message.type === 'success' ? s.alertSuccess : s.alertError) }}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          <button onClick={() => setMessage(null)} style={s.alertClose}>✕</button>
        </div>
      )}

      {/* ── Recherche ── */}
      <div style={s.searchWrap}>
        <span>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un profil..."
          style={s.searchInput}
        />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>}
      </div>

      {/* ── Grille des rôles ── */}
      <div style={s.grid}>
        {filteredRoles.map((role, idx) => {
          const color       = ROLE_COLORS[idx % ROLE_COLORS.length];
          const empCount    = countEmployesByRole(role.id);
          const isAdmin     = isAdminRole(role);

          return (
            <div
              key={role.id}
              className="role-card"
              style={{
                ...s.card,
                transition: 'all 0.25s',
                animationDelay: `${idx * 50}ms`,
                animation: 'slideUp 0.4s ease both',
                ...(isAdmin ? { border: '1.5px solid #fef3c7' } : {}),
              }}
            >
              {/* Bande colorée + badge admin */}
              <div style={{ height: 5, background: color, borderRadius: '18px 18px 0 0', margin: '-24px -24px 20px', position: 'relative' }}>
                {isAdmin && (
                  <div style={{
                    position: 'absolute', right: 12, top: 8,
                    background: '#fef3c7', color: '#b45309',
                    fontSize: 10, fontWeight: 800, padding: '2px 8px',
                    borderRadius: 999, fontFamily: "'Poppins', sans-serif",
                  }}>
                    🔒 Protégé
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div style={{ ...s.roleIcon, background: `${color}18`, color }}>
                  {role.nom[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={s.roleName}>{role.nom}</h3>
                  <p style={s.roleDesc}>{role.description || 'Aucune description'}</p>
                </div>
              </div>

              {/* Compteur d'employés */}
              <div style={s.empCountRow}>
                <div style={{ ...s.empCountBadge, background: empCount > 0 ? `${color}12` : '#f8fafc', color: empCount > 0 ? color : '#94a3b8', border: `1px solid ${empCount > 0 ? `${color}30` : '#e2e8f0'}` }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>{empCount}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>
                    {empCount === 0 ? 'aucun employé' : empCount === 1 ? 'employé' : 'employés'}
                  </span>
                </div>
                {empCount > 0 && (
                  <div style={{ display: 'flex', marginLeft: 'auto' }}>
                    {/* Mini-avatars des employés ayant ce rôle (max 3) */}
                    {users.filter(u => u.roles?.some(r => r.id === role.id)).slice(0, 3).map((u, i) => (
                      <div
                        key={u.id}
                        title={`${u.prenom} ${u.nom}`}
                        style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: color, color: 'white',
                          fontSize: 10, fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid white',
                          marginLeft: i > 0 ? -8 : 0,
                          zIndex: 3 - i,
                          position: 'relative',
                        }}
                      >
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </div>
                    ))}
                    {empCount > 3 && (
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: '#f1f5f9', color: '#64748b',
                        fontSize: 9, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white', marginLeft: -8,
                      }}>
                        +{empCount - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={s.cardActions}>
                {hasPermission('roles', 'read') && (
                  <button
                    className="card-btn"
                    style={{ ...s.cardBtn, color, background: `${color}12`, borderColor: `${color}30` }}
                    onClick={() => ouvrirPermissions(role)}
                  >
                    ⚙️ Permissions
                  </button>
                )}
                {hasPermission('roles', 'delete') && !isAdmin ? (
                  <button
                    className="card-btn"
                    style={{ ...s.cardBtn, color: '#dc2626', background: '#fee2e2', borderColor: '#fecaca' }}
                    onClick={() => handleDelete(role)}
                  >
                    🗑 Supprimer
                  </button>
                ) : (
                  /* Bouton désactivé visuellement pour le rôle admin */
                  <div style={{ ...s.cardBtn, color: '#d1d5db', background: '#f9fafb', borderColor: '#e5e7eb', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 9, border: '1.5px solid' }} title="Ce rôle est protégé et ne peut pas être supprimé">
                    🔒 Protégé
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Carte "Ajouter" */}
        {hasPermission('roles', 'create') && (
          <div
            onClick={() => setShowCreateModal(true)}
            style={{ ...s.card, border: '2px dashed #e2e8f0', background: '#fafbfc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 160, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.background = '#f0fdf4'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafbfc'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#e8f5e9', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>+</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>Nouveau profil</span>
          </div>
        )}
      </div>

      {/* ── Modal création ── */}
      {showCreateModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Créer un nouveau profil</h2>
              <button onClick={() => setShowCreateModal(false)} style={s.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.field}>
                <label style={s.label}>Nom du profil *</label>
                <input
                  type="text" value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Technicien, Commercial, Superviseur..."
                  required style={s.input}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez les responsabilités de ce profil..."
                  style={{ ...s.input, minHeight: 90, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={s.btnSecondary}>Annuler</button>
                <button type="submit" disabled={createLoading} style={s.btnPrimary}>
                  {createLoading ? '⏳ Création...' : '✓ Créer le profil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal permissions ── */}
      {showPermModal && selectedRole && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowPermModal(false)}>
          <div style={{ ...s.modal, maxWidth: 720 }}>
            <div style={s.modalHeader}>
              <div>
                <h2 style={s.modalTitle}>Permissions — {selectedRole.nom}</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Cochez les actions autorisées pour ce profil</p>
              </div>
              <button onClick={() => setShowPermModal(false)} style={s.closeBtn}>✕</button>
            </div>

            {matriceLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <div style={{ width: 32, height: 32, border: '4px solid #e2e8f0', borderTopColor: '#4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                Chargement des permissions...
              </div>
            ) : (
              <>
                {/* Résumé */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {matrice.map((r, ri) => {
                    const activeCount = r.permissions.filter(p => p.active).length;
                    const total = r.permissions.length;
                    return (
                      <div key={ri} style={{ padding: '4px 12px', borderRadius: 999, background: activeCount > 0 ? '#dcfce7' : '#f1f5f9', color: activeCount > 0 ? '#15803d' : '#94a3b8', fontSize: 12, fontWeight: 700 }}>
                        {r.ressource_nom}: {activeCount}/{total}
                      </div>
                    );
                  })}
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '50vh', overflowY: 'auto' }}>
                  <table style={s.permTable}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={s.permTh}>Ressource</th>
                        {['Créer', 'Lire', 'Modifier', 'Supprimer'].map(a => (
                          <th key={a} style={{ ...s.permTh, textAlign: 'center' }}>{a}</th>
                        ))}
                        <th style={{ ...s.permTh, textAlign: 'center' }}>Tout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrice.map((ressource, ri) => {
                        const allActive = ressource.permissions.every(p => p.active);
                        return (
                          <tr key={ressource.ressource_id} className="perm-row" style={{ borderBottom: '1px solid #f0f4f8', transition: 'background 0.15s' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13, color: '#374151', textTransform: 'capitalize' }}>
                              {ressource.ressource_nom}
                            </td>
                            {['create', 'read', 'update', 'delete'].map(action => {
                              const perm = ressource.permissions.find(p => p.action === action);
                              const pi   = ressource.permissions.findIndex(p => p.action === action);
                              return (
                                <td key={action} style={{ padding: '12px 16px', textAlign: 'center' }}>
                                  {perm ? (
                                    <input
                                      type="checkbox"
                                      checked={perm.active}
                                      onChange={() => togglePermission(ri, pi)}
                                      style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#4CAF50' }}
                                    />
                                  ) : <span style={{ color: '#e2e8f0' }}>—</span>}
                                </td>
                              );
                            })}
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <button
                                className="check-all"
                                onClick={() => toggleAllRessource(ri)}
                                style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: allActive ? '#dc2626' : '#4CAF50', transition: 'background 0.15s', fontFamily: "'Poppins', sans-serif" }}
                              >
                                {allActive ? 'Aucun' : 'Tout'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f4f8' }}>
                  <button onClick={() => setShowPermModal(false)} style={s.btnSecondary}>Annuler</button>
                  <button onClick={sauvegarderPermissions} disabled={saveLoading} style={s.btnPrimary}>
                    {saveLoading ? '⏳ Sauvegarde...' : '✓ Sauvegarder les permissions'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}

const s = {
  page:         { padding: '32px', maxWidth: 1200, margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:        { fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' },
  subtitle:     { fontSize: 14, color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 },
  countBadge:   { background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  btnPrimary:   { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg, #006837, #4CAF50)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(76,175,80,0.3)', fontFamily: "'Poppins', sans-serif" },
  btnSecondary: { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  alert:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 500, animation: 'fadeIn 0.3s ease' },
  alertSuccess: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' },
  alertError:   { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' },
  alertClose:   { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'inherit' },
  searchWrap:   { display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '9px 14px', marginBottom: 20, maxWidth: 340 },
  searchInput:  { border: 'none', outline: 'none', fontSize: 14, flex: 1, fontFamily: "'Poppins', sans-serif", color: '#1a1a1a' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18 },
  card:         { background: 'white', borderRadius: 18, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f4f8' },
  roleIcon:     { width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 },
  roleName:     { fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
  roleDesc:     { fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 },
  empCountRow:  { display: 'flex', alignItems: 'center', marginBottom: 16 },
  empCountBadge:{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, flexShrink: 0 },
  cardActions:  { display: 'flex', gap: 8, flexWrap: 'wrap' },
  cardBtn:      { padding: '7px 14px', border: '1.5px solid', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'filter 0.15s', fontFamily: "'Poppins', sans-serif" },
  overlay:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
  modal:        { background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.2)', animation: 'fadeIn 0.25s ease' },
  modalHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  modalTitle:   { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 },
  closeBtn:     { width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  field:        { display: 'flex', flexDirection: 'column', gap: 6 },
  label:        { fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input:        { padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: "'Poppins', sans-serif", color: '#1a1a1a', width: '100%', boxSizing: 'border-box' },
  permTable:    { width: '100%', borderCollapse: 'collapse' },
  permTh:       { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0f4f8' },
};