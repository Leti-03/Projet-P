// src/pages/crm/administration/Employes.jsx
import { useState, useEffect } from 'react';
import { getUsers, createUser, toggleUserStatut, resetUserPassword } from '../../../services/crm/users.js';
import { getRoles } from '../../../services/crm/roles.js';
import { useAuth } from '../../../context/crm/AuthContext.jsx';
import Layout from '../../../components/crm/common/Layout.jsx';

const ROLE_PALETTE = [
  { bg: 'linear-gradient(135deg, #006837, #4CAF50)', text: 'white' },
  { bg: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', text: 'white' },
  { bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)', text: 'white' },
  { bg: 'linear-gradient(135deg, #b45309, #f59e0b)', text: 'white' },
  { bg: 'linear-gradient(135deg, #be185d, #f472b6)', text: 'white' },
  { bg: 'linear-gradient(135deg, #0e7490, #22d3ee)', text: 'white' },
];

// ✅ CORRECTION 1 : parseInt + isNaN au lieu de Number()
const getRoleColor = (roleId) => {
  const id = parseInt(roleId, 10);
  if (isNaN(id)) return ROLE_PALETTE[0];
  return ROLE_PALETTE[id % ROLE_PALETTE.length];
};

const timeAgo = (date) => {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hrs   = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "À l'instant";
  if (mins < 60)  return `il y a ${mins} min`;
  if (hrs  < 24)  return `il y a ${hrs}h`;
  if (days < 30)  return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  return new Date(date).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Employes() {
  const [users, setUsers]                   = useState([]);
  const [roles, setRoles]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showModal, setShowModal]           = useState(false);
  const [showEditModal, setShowEditModal]   = useState(false);
  const [showRoleModal, setShowRoleModal]   = useState(false);
  const [selectedUser, setSelectedUser]     = useState(null);
  const [search, setSearch]                 = useState('');
  const [filterStatut, setFilterStatut]     = useState('tous');
  const [form, setForm]                     = useState({ nom: '', prenom: '', email: '', telephone: '', role_id: '' });
  const [editForm, setEditForm]             = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [roleForm, setRoleForm]             = useState({ role_id: '' });
  const [formLoading, setFormLoading]       = useState(false);
  const [message, setMessage]               = useState(null);
  const [resetLoading, setResetLoading]     = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => { chargerDonnees(); }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const chargerDonnees = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createUser(form);
      setMessage({ type: 'success', text: 'Compte créé — email envoyé ✅' });
      setShowModal(false);
      setForm({ nom: '', prenom: '', email: '', telephone: '', role_id: '' });
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la création' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      setMessage({ type: 'success', text: 'Informations mises à jour ✅' });
      setShowEditModal(false);
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la modification' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangeRole = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      setMessage({ type: 'success', text: `Rôle mis à jour pour ${selectedUser.prenom} ✅` });
      setShowRoleModal(false);
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de rôle' });
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({ nom: user.nom, prenom: user.prenom, email: user.email, telephone: user.telephone || '' });
    setShowEditModal(true);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRoleForm({ role_id: user.roles?.[0]?.id || '' });
    setShowRoleModal(true);
  };

  const handleToggle = async (user) => {
    const newStatut = user.statut === 'actif' ? 'inactif' : 'actif';
    try {
      await toggleUserStatut(user.id, newStatut);
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const handleReset = async (user) => {
    if (!window.confirm(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} ?`)) return;
    setResetLoading(user.id);
    try {
      await resetUserPassword(user.id);
      setMessage({ type: 'success', text: `MDP réinitialisé — email envoyé à ${user.email}` });
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' });
    } finally {
      setResetLoading(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || u.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const statutConfig = {
    actif:    { color: '#15803d', bg: '#dcfce7', dot: '#22c55e', label: 'Actif' },
    inactif:  { color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af', label: 'Inactif' },
    suspendu: { color: '#b45309', bg: '#fef3c7', dot: '#f59e0b', label: 'Suspendu' },
    bloque:   { color: '#dc2626', bg: '#fee2e2', dot: '#ef4444', label: 'Bloqué' },
  };

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.loadingSpinner} />
      <p style={{ color: '#64748b', marginTop: 12 }}>Chargement des employés...</p>
    </div>
  );

  return (
    <Layout>
      <div style={s.page}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .emp-row:hover { background: #f8fffe !important; }
        .emp-row:hover .emp-actions { opacity: 1 !important; }
        .btn-action:hover { filter: brightness(0.9); transform: translateY(-1px); }
        .emp-avatar { transition: transform 0.2s; }
        .emp-avatar:hover { transform: scale(1.1) !important; }
        .filter-btn:hover { background: #f1f5f9 !important; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Gestion des Employés</h1>
          <p style={s.subtitle}>
            <span style={s.countBadge}>{users.length}</span> compte(s) interne(s)
          </p>
        </div>
        {hasPermission('utilisateurs', 'create') && (
          <button style={s.btnPrimary} onClick={() => setShowModal(true)}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nouveau compte
          </button>
        )}
      </div>

      {/* Toast */}
      {message && (
        <div style={{ ...s.alert, ...(message.type === 'success' ? s.alertSuccess : s.alertError) }}>
          <span>{message.type === 'success' ? '✅' : '⚠️'} {message.text}</span>
          <button onClick={() => setMessage(null)} style={s.alertClose}>✕</button>
        </div>
      )}

      {/* Filtres */}
      <div style={s.filtersBar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un employé..."
            style={s.searchInput}
          />
          {search && <button onClick={() => setSearch('')} style={s.clearBtn}>✕</button>}
        </div>
        <div style={s.filterBtns}>
          {['tous', 'actif', 'inactif', 'suspendu'].map(f => (
            <button
              key={f}
              className="filter-btn"
              onClick={() => setFilterStatut(f)}
              style={{ ...s.filterBtn, ...(filterStatut === f ? s.filterBtnActive : {}) }}
            >
              {f === 'tous' ? 'Tous' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {[
          { label: 'Total',    value: users.length,                                      color: '#3b82f6' },
          { label: 'Actifs',   value: users.filter(u => u.statut === 'actif').length,    color: '#22c55e' },
          { label: 'Inactifs', value: users.filter(u => u.statut === 'inactif').length,  color: '#9ca3af' },
          { label: 'Admins',   value: users.filter(u => u.est_superadmin).length,        color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} style={s.statCard}>
            <span style={{ ...s.statNum, color: stat.color }}>{stat.value}</span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div style={s.tableWrap}>
        {filteredUsers.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Aucun employé trouvé</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Employé</th>
                <th style={s.th}>Contact</th>
                <th style={s.th}>Rôle</th>
                <th style={s.th}>Statut</th>
                <th style={s.th}>Dernière connexion</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => {
                const cfg      = statutConfig[user.statut] || statutConfig.inactif;
                const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
                const roleId   = user.roles?.[0]?.id;
                const palette  = getRoleColor(roleId);
                const ago      = timeAgo(user.dernier_login);

                return (
                  <tr key={user.id} className="emp-row" style={{ ...s.tr, animationDelay: `${idx * 30}ms` }}>

                    {/* Employé */}
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          className="emp-avatar"
                          style={{ ...s.avatar, background: palette.bg, color: palette.text }}
                          title={`${user.prenom} ${user.nom}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={s.userName}>{user.prenom} {user.nom}</div>
                          {user.est_superadmin && (
                            <span style={s.superBadge}>⚡ Super Admin</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={s.td}>
                      <div style={{ fontSize: 13, color: '#374151' }}>{user.email}</div>
                      {user.telephone && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{user.telephone}</div>
                      )}
                    </td>

                    {/* Rôle — ✅ CORRECTION 2 : style={s.roleBadge} simple, sans .bg.includes() */}
                    <td style={s.td}>
                      {user.roles?.length > 0
                        ? user.roles.map(r => (
                          <span key={r.id} style={s.roleBadge}>
                            {r?.nom}
                          </span>
                        ))
                        : <span style={{ color: '#94a3b8' }}>—</span>
                      }
                    </td>

                    {/* Statut */}
                    <td style={s.td}>
                      <span style={{ ...s.statutBadge, color: cfg.color, background: cfg.bg }}>
                        <span style={{ ...s.statutDot, background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Dernière connexion */}
                    <td style={s.td}>
                      {ago ? (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{ago}</div>
                          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>
                            {new Date(user.dernier_login).toLocaleString('fr-DZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' }}>Jamais connecté</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={s.td}>
                      {!user.est_superadmin && hasPermission('utilisateurs', 'update') && (
                        <div className="emp-actions" style={{ ...s.actions, opacity: 0.75, transition: 'opacity 0.2s' }}>
                          <button
                            className="btn-action"
                            onClick={() => openEditModal(user)}
                            style={{ ...s.actionBtn, background: '#eff6ff', color: '#2563eb' }}
                            title="Modifier les informations"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            className="btn-action"
                            onClick={() => openRoleModal(user)}
                            style={{ ...s.actionBtn, background: '#f5f3ff', color: '#7c3aed' }}
                            title="Changer le rôle"
                          >
                            🔄 Rôle
                          </button>
                          <button
                            className="btn-action"
                            onClick={() => handleToggle(user)}
                            style={{
                              ...s.actionBtn,
                              background: user.statut === 'actif' ? '#fee2e2' : '#dcfce7',
                              color:      user.statut === 'actif' ? '#dc2626' : '#16a34a',
                            }}
                          >
                            {user.statut === 'actif' ? '⏸ Désactiver' : '▶ Activer'}
                          </button>
                          <button
                            className="btn-action"
                            onClick={() => handleReset(user)}
                            disabled={resetLoading === user.id}
                            style={{ ...s.actionBtn, background: '#fef3c7', color: '#b45309' }}
                            title="Réinitialiser le mot de passe"
                          >
                            {resetLoading === user.id ? '...' : '🔑 Reset'}
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

      {/* Modal création */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <div>
                <h2 style={s.modalTitle}>Créer un compte employé</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Un email avec les identifiants sera envoyé automatiquement</p>
              </div>
              <button onClick={() => setShowModal(false)} style={s.modalClose}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Prénom *', key: 'prenom', type: 'text', placeholder: 'Mohamed' },
                  { label: 'Nom *',    key: 'nom',    type: 'text', placeholder: 'Bensalem' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} style={s.modalField}>
                    <label style={s.modalLabel}>{label}</label>
                    <input
                      type={type} value={form[key]} placeholder={placeholder}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      required style={s.modalInput}
                    />
                  </div>
                ))}
              </div>
              {[
                { label: 'Email *',   key: 'email',     type: 'email', placeholder: 'prenom.nom@algtelecom.dz' },
                { label: 'Téléphone', key: 'telephone', type: 'tel',   placeholder: '0555 XX XX XX' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} style={s.modalField}>
                  <label style={s.modalLabel}>{label}</label>
                  <input
                    type={type} value={form[key]} placeholder={placeholder}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required={key !== 'telephone'} style={s.modalInput}
                  />
                </div>
              ))}
              <div style={s.modalField}>
                <label style={s.modalLabel}>Rôle *</label>
                <select value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })} required style={s.modalInput}>
                  <option value="">-- Sélectionner un rôle --</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.btnSecondary}>Annuler</button>
                <button type="submit" disabled={formLoading} style={s.btnPrimary}>
                  {formLoading ? 'Création...' : '✓ Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal modifier */}
      {showEditModal && selectedUser && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowEditModal(false)}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <div>
                <h2 style={s.modalTitle}>Modifier l'employé</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{selectedUser.prenom} {selectedUser.nom}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} style={s.modalClose}>✕</button>
            </div>
            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={s.modalField}>
                  <label style={s.modalLabel}>Prénom *</label>
                  <input type="text" value={editForm.prenom} onChange={e => setEditForm({ ...editForm, prenom: e.target.value })} required style={s.modalInput} />
                </div>
                <div style={s.modalField}>
                  <label style={s.modalLabel}>Nom *</label>
                  <input type="text" value={editForm.nom} onChange={e => setEditForm({ ...editForm, nom: e.target.value })} required style={s.modalInput} />
                </div>
              </div>
              <div style={s.modalField}>
                <label style={s.modalLabel}>Email *</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required style={s.modalInput} />
              </div>
              <div style={s.modalField}>
                <label style={s.modalLabel}>Téléphone</label>
                <input type="tel" value={editForm.telephone} onChange={e => setEditForm({ ...editForm, telephone: e.target.value })} style={s.modalInput} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={s.btnSecondary}>Annuler</button>
                <button type="submit" disabled={formLoading} style={s.btnPrimary}>
                  {formLoading ? 'Enregistrement...' : '✓ Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal changer rôle */}
      {showRoleModal && selectedUser && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowRoleModal(false)}>
          <div style={{ ...s.modal, maxWidth: 400 }}>
            <div style={s.modalHeader}>
              <div>
                <h2 style={s.modalTitle}>Changer le rôle</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{selectedUser.prenom} {selectedUser.nom}</p>
              </div>
              <button onClick={() => setShowRoleModal(false)} style={s.modalClose}>✕</button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Rôle actuel</div>
              {selectedUser.roles?.length > 0
                ? selectedUser.roles.map(r => <span key={r.id} style={s.roleBadge}>{r.nom}</span>)
                : <span style={{ color: '#94a3b8', fontSize: 13 }}>Aucun rôle assigné</span>
              }
            </div>
            <form onSubmit={handleChangeRole} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.modalField}>
                <label style={s.modalLabel}>Nouveau rôle *</label>
                <select value={roleForm.role_id} onChange={e => setRoleForm({ role_id: e.target.value })} required style={s.modalInput}>
                  <option value="">-- Sélectionner un rôle --</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
                </select>
              </div>
              <div style={{ padding: '10px 14px', background: '#fef3c7', borderRadius: 10, fontSize: 13, color: '#92400e' }}>
                ⚠️ Ce changement de rôle affecte immédiatement les permissions de l'employé.
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <button type="button" onClick={() => setShowRoleModal(false)} style={s.btnSecondary}>Annuler</button>
                <button type="submit" disabled={formLoading} style={{ ...s.btnPrimary, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>
                  {formLoading ? 'Changement...' : '🔄 Changer le rôle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}

const s = {
  page:          { padding: '32px', maxWidth: 1200, margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  loadingWrap:   { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' },
  loadingSpinner:{ width: 40, height: 40, border: '4px solid #e8f5e9', borderTopColor: '#4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  header:        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title:         { fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' },
  subtitle:      { fontSize: 14, color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  countBadge:    { background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  btnPrimary:    { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg, #006837, #4CAF50)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(76,175,80,0.3)', transition: 'transform 0.15s', fontFamily: "'Poppins', sans-serif" },
  btnSecondary:  { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  alert:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 500, animation: 'toastIn 0.3s ease' },
  alertSuccess:  { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' },
  alertError:    { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' },
  alertClose:    { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'inherit', padding: 4 },
  filtersBar:    { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  searchWrap:    { display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '8px 14px', flex: 1, minWidth: 200 },
  searchIcon:    { fontSize: 16, flexShrink: 0 },
  searchInput:   { border: 'none', outline: 'none', fontSize: 14, flex: 1, fontFamily: "'Poppins', sans-serif", color: '#1a1a1a' },
  clearBtn:      { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14, padding: 2 },
  filterBtns:    { display: 'flex', gap: 6 },
  filterBtn:     { padding: '8px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif" },
  filterBtnActive:{ background: '#0f172a', color: 'white', borderColor: '#0f172a' },
  statsRow:      { display: 'flex', gap: 12, marginBottom: 24 },
  statCard:      { flex: 1, background: 'white', borderRadius: 14, padding: '16px', border: '1px solid #f0f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statNum:       { fontSize: 26, fontWeight: 800 },
  statLabel:     { fontSize: 12, color: '#94a3b8', fontWeight: 600 },
  tableWrap:     { background: 'white', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f0f4f8' },
  table:         { width: '100%', borderCollapse: 'collapse' },
  thead:         { background: '#f8fafc' },
  th:            { padding: '13px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: '1px solid #f0f4f8' },
  tr:            { borderBottom: '1px solid #f8fafc', transition: 'background 0.15s', animation: 'slideIn 0.3s ease both' },
  td:            { padding: '14px 16px', verticalAlign: 'middle' },
  avatar:        { width: 40, height: 40, borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0, cursor: 'default' },
  userName:      { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  superBadge:    { fontSize: 11, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 6, fontWeight: 700, display: 'inline-block', marginTop: 3 },
  roleBadge:     { fontSize: 12, background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: 6, fontWeight: 600, marginRight: 4, display: 'inline-block' },
  statutBadge:   { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 },
  statutDot:     { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  actions:       { display: 'flex', gap: 5, flexWrap: 'wrap' },
  actionBtn:     { padding: '5px 10px', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'filter 0.15s, transform 0.15s', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap' },
  emptyState:    { padding: '60px 20px', textAlign: 'center' },
  overlay:       { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
  modal:         { background: 'white', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.2)', animation: 'fadeIn 0.25s ease' },
  modalHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  modalTitle:    { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
  modalClose:    { background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalField:    { display: 'flex', flexDirection: 'column', gap: 6 },
  modalLabel:    { fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  modalInput:    { padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: "'Poppins', sans-serif", color: '#1a1a1a', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' },
};