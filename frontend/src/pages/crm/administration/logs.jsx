// src/pages/crm/administration/logs.jsx
import { useState, useEffect, useRef } from 'react';
import { getLogs } from '../../../services/crm/logs.js';

const ACTIONS    = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'RESET_PASSWORD'];
const RESSOURCES = ['auth', 'clients', 'factures', 'reclamations', 'interventions', 'utilisateurs_internes', 'roles', 'roles_permissions'];

const ACTION_CFG = {
  LOGIN:          { color: '#15803d', bg: '#dcfce7',  rowBg: '#f0fdf4',  icon: '→', label: 'Connexion'    },
  LOGOUT:         { color: '#64748b', bg: '#f1f5f9',  rowBg: '#f8fafc',  icon: '←', label: 'Déconnexion'  },
  CREATE:         { color: '#1d4ed8', bg: '#dbeafe',  rowBg: '#eff6ff',  icon: '+', label: 'Création'     },
  UPDATE:         { color: '#b45309', bg: '#fef3c7',  rowBg: '#fffbeb',  icon: '✎', label: 'Modification' },
  DELETE:         { color: '#dc2626', bg: '#fee2e2',  rowBg: '#fff5f5',  icon: '✕', label: 'Suppression'  },
  RESET_PASSWORD: { color: '#7c3aed', bg: '#ede9fe',  rowBg: '#f5f3ff',  icon: '⟳', label: 'Reset MDP'    },
};

// ── Export CSV ──────────────────────────────────────────────────────────────
const exportCSV = (logs) => {
  const headers = ['#', 'Utilisateur', 'Email', 'Action', 'Ressource', 'Détails', 'IP', 'Date'];
  const rows = logs.map((log, i) => [
    i + 1,
    log.utilisateurs_internes ? `${log.utilisateurs_internes.prenom} ${log.utilisateurs_internes.nom}` : 'Système',
    log.utilisateurs_internes?.email || '',
    log.action,
    log.ressource || '',
    log.details ? JSON.stringify(log.details).replace(/"/g, "'") : '',
    log.ip_address || '',
    log.date_action ? new Date(log.date_action).toLocaleString('fr-DZ') : '',
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `logs_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Temps relatif ────────────────────────────────────────────────────────────
const getTimeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `il y a ${days}j`;
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('fr-DZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// ── JSON Viewer ──────────────────────────────────────────────────────────────
function JsonViewer({ data }) {
  if (!data) return <span style={{ color: '#94a3b8' }}>Aucun détail</span>;
  const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return (
    <pre style={{
      margin: 0, padding: '12px 16px',
      background: '#0f172a', color: '#e2e8f0',
      borderRadius: 10, fontSize: 12,
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      overflowX: 'auto', maxHeight: 300,
      lineHeight: 1.6,
    }}>
      {str}
    </pre>
  );
}

export default function Logs() {
  const [logs, setLogs]               = useState([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [filters, setFilters]         = useState({ action: '', ressource: '', date_debut: '', date_fin: '' });
  const [exporting, setExporting]     = useState(false);
  const limit = 20;

  useEffect(() => { chargerLogs(); }, [page, filters]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(chargerLogs, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, page, filters]);

  const chargerLogs = async () => {
    setLoading(true);
    try {
      const result = await getLogs({ ...filters, page, limit });
      setLogs(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ action: '', ressource: '', date_debut: '', date_fin: '' });
    setPage(1);
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Exporter tous les logs filtrés (sans pagination)
      const result = await getLogs({ ...filters, page: 1, limit: 9999 });
      exportCSV(result.data || []);
    } catch {
      exportCSV(logs); // fallback sur la page courante
    } finally {
      setExporting(false);
    }
  };

  const totalPages          = Math.ceil(total / limit);
  const activeFiltersCount  = Object.values(filters).filter(Boolean).length;

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes expand  { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 400px; } }
        .log-row:hover        { background: inherit; filter: brightness(0.97); }
        .filter-select:focus  { border-color: #4CAF50 !important; outline: none; }
        .page-btn:hover:not(:disabled) { background: #006837 !important; color: white !important; }
        .export-btn:hover     { background: #059669 !important; }
        .expand-btn:hover     { background: #f1f5f9 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Logs d'activité</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span style={s.countBadge}>{total} action(s)</span>
            {autoRefresh && (
              <span style={s.liveBadge}>
                <span style={s.liveDot} />Live
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{ ...s.headerBtn, background: autoRefresh ? '#dcfce7' : 'white', color: autoRefresh ? '#15803d' : '#64748b', borderColor: autoRefresh ? '#bbf7d0' : '#e2e8f0' }}
          >
            {autoRefresh ? '⏸ Pause' : '▶ Auto-refresh'}
          </button>
          <button onClick={chargerLogs} style={s.headerBtn} disabled={loading}>
            <span style={loading ? { display: 'inline-block', animation: 'spin 0.8s linear infinite' } : {}}>⟳</span> Actualiser
          </button>
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={exporting}
            style={{ ...s.headerBtn, background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0', fontWeight: 700 }}
            title="Exporter les logs en CSV"
          >
            {exporting ? '⏳' : '⬇️'} Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats rapides (cliquables) ── */}
      <div style={s.statsRow}>
        {ACTIONS.slice(0, 6).map(action => {
          const cfg   = ACTION_CFG[action] || {};
          const count = logs.filter(l => l.action === action).length;
          const isActive = filters.action === action;
          return (
            <div
              key={action}
              onClick={() => handleFilter('action', isActive ? '' : action)}
              style={{
                ...s.statChip,
                background:   isActive ? cfg.bg    : 'white',
                borderColor:  isActive ? cfg.color : '#e2e8f0',
                cursor: 'pointer',
                transform: isActive ? 'translateY(-2px)' : 'none',
                boxShadow: isActive ? `0 4px 14px ${cfg.color}20` : 'none',
              }}
            >
              <span style={{ ...s.statChipIcon, background: cfg.bg, color: cfg.color }}>{cfg.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{cfg.label || action}</span>
              <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', fontWeight: 600 }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* ── Filtres ── */}
      <div style={s.filtersWrap}>
        <select className="filter-select" value={filters.action} onChange={e => handleFilter('action', e.target.value)} style={s.select}>
          <option value="">Toutes les actions</option>
          {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="filter-select" value={filters.ressource} onChange={e => handleFilter('ressource', e.target.value)} style={s.select}>
          <option value="">Toutes les ressources</option>
          {RESSOURCES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input type="date" value={filters.date_debut} onChange={e => handleFilter('date_debut', e.target.value)} style={s.dateInput} title="Date début" />
        <span style={{ color: '#94a3b8', fontSize: 13 }}>→</span>
        <input type="date" value={filters.date_fin} onChange={e => handleFilter('date_fin', e.target.value)} style={s.dateInput} title="Date fin" />
        {activeFiltersCount > 0 && (
          <button onClick={resetFilters} style={s.resetBtn}>
            ✕ Effacer ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* ── Tableau ── */}
      {loading ? (
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <p style={{ color: '#94a3b8', marginTop: 12 }}>Chargement des logs...</p>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={{ ...s.th, width: 32 }}></th>
                <th style={s.th}>#</th>
                <th style={s.th}>Utilisateur</th>
                <th style={s.th}>Action</th>
                <th style={s.th}>Ressource</th>
                <th style={s.th}>Détails</th>
                <th style={s.th}>IP</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    <div style={{ fontWeight: 600 }}>Aucun log trouvé</div>
                  </td>
                </tr>
              ) : logs.map((log, idx) => {
                const cfg      = ACTION_CFG[log.action] || { color: '#64748b', bg: '#f1f5f9', rowBg: '#f8fafc', icon: '•' };
                const isExpanded = expandedRows.has(log.id);
                const hasDetails = log.details && Object.keys(log.details || {}).length > 0;

                return (
                  <>
                    {/* ── Ligne principale ── */}
                    <tr
                      key={log.id}
                      className="log-row"
                      style={{
                        borderBottom: isExpanded ? 'none' : '1px solid #f8fafc',
                        transition: 'filter 0.15s',
                        animation: `fadeIn 0.3s ease both`,
                        animationDelay: `${idx * 15}ms`,
                        background: cfg.rowBg,
                      }}
                    >
                      {/* Expand toggle */}
                      <td style={{ padding: '10px 8px 10px 12px', verticalAlign: 'middle' }}>
                        {hasDetails && (
                          <button
                            className="expand-btn"
                            onClick={() => toggleRow(log.id)}
                            style={{
                              width: 24, height: 24, borderRadius: 6,
                              border: '1px solid #e2e8f0', background: 'white',
                              cursor: 'pointer', fontSize: 10, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#64748b', transition: 'background 0.15s',
                              transform: isExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s, background 0.15s',
                            }}
                            title="Voir les détails JSON"
                          >
                            ›
                          </button>
                        )}
                      </td>

                      <td style={{ ...s.td, color: '#cbd5e1', fontSize: 12 }}>
                        {(page - 1) * limit + idx + 1}
                      </td>

                      <td style={s.td}>
                        {log.utilisateurs_internes ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={s.avatar}>
                              {log.utilisateurs_internes.prenom?.[0]}{log.utilisateurs_internes.nom?.[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                                {log.utilisateurs_internes.prenom} {log.utilisateurs_internes.nom}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>{log.utilisateurs_internes.email}</div>
                            </div>
                          </div>
                        ) : <span style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>Système</span>}
                      </td>

                      <td style={s.td}>
                        <span style={{ ...s.actionBadge, color: cfg.color, background: cfg.bg }}>
                          <span style={{ fontWeight: 800, marginRight: 4 }}>{cfg.icon}</span>
                          {log.action}
                        </span>
                      </td>

                      <td style={s.td}>
                        <span style={s.ressourceBadge}>{log.ressource || '—'}</span>
                      </td>

                      <td style={{ ...s.td, maxWidth: 200 }}>
                        {hasDetails ? (
                          <button
                            onClick={() => toggleRow(log.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                              fontSize: 11, color: '#94a3b8', fontFamily: 'monospace',
                              textAlign: 'left', textDecoration: 'underline dotted',
                            }}
                            title="Cliquer pour voir le JSON complet"
                          >
                            {JSON.stringify(log.details).slice(0, 40)}
                            {JSON.stringify(log.details).length > 40 ? '…' : ''}
                          </button>
                        ) : <span style={{ color: '#e2e8f0' }}>—</span>}
                      </td>

                      <td style={s.td}>
                        <span style={s.ipBadge}>{log.ip_address || '—'}</span>
                      </td>

                      <td style={s.td}>
                        <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{getTimeAgo(log.date_action)}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{formatDate(log.date_action)}</div>
                      </td>
                    </tr>

                    {/* ── Ligne expandable (détails JSON) ── */}
                    {isExpanded && hasDetails && (
                      <tr key={`${log.id}-details`} style={{ background: '#0f172a', animation: 'expand 0.25s ease' }}>
                        <td colSpan={8} style={{ padding: '0 16px 16px 60px' }}>
                          <div style={{ paddingTop: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>
                              Détails — {log.action} sur {log.ressource}
                            </div>
                            <JsonViewer data={log.details} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1} style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1 }}>«</button>
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1 }}>‹</button>

          {/* Pages numérotées */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
            if (p < 1 || p > totalPages) return null;
            return (
              <button
                key={p}
                className="page-btn"
                onClick={() => setPage(p)}
                style={{ ...s.pageBtn, ...(p === page ? { background: '#0f172a', color: 'white', borderColor: '#0f172a' } : {}), minWidth: 36 }}
              >
                {p}
              </button>
            );
          })}

          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...s.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}>›</button>
          <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ ...s.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}>»</button>

          <span style={s.pageInfo}>Page <strong>{page}</strong> / {totalPages} — {total} logs</span>
        </div>
      )}
    </div>
  );
}

const s = {
  page:         { padding: '32px', maxWidth: 1400, margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:        { fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
  countBadge:   { background: '#f1f5f9', color: '#475569', padding: '3px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  liveBadge:    { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 },
  liveDot:      { width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' },
  headerBtn:    { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif" },
  statsRow:     { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  statChip:     { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, border: '1.5px solid', transition: 'all 0.2s', minWidth: 120 },
  statChipIcon: { width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 },
  filtersWrap:  { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  select:       { padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, background: 'white', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", color: '#374151', transition: 'border-color 0.2s' },
  dateInput:    { padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Poppins', sans-serif", color: '#374151', outline: 'none' },
  resetBtn:     { padding: '9px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  loadingWrap:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' },
  spinner:      { width: 36, height: 36, border: '4px solid #e2e8f0', borderTopColor: '#4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  tableWrap:    { background: 'white', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'auto', border: '1px solid #f0f4f8' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { background: '#f8fafc' },
  th:           { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: '1px solid #f0f4f8', whiteSpace: 'nowrap' },
  td:           { padding: '11px 16px', fontSize: 13, color: '#374151', verticalAlign: 'middle' },
  avatar:       { width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #006837, #4CAF50)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 },
  actionBadge:  { display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' },
  ressourceBadge:{ fontSize: 12, color: '#475569', fontFamily: 'monospace', background: '#f1f5f9', padding: '3px 8px', borderRadius: 6 },
  ipBadge:      { fontSize: 11, color: '#64748b', fontFamily: 'monospace' },
  pagination:   { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24, flexWrap: 'wrap' },
  pageBtn:      { padding: '8px 14px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif' " },
  pageInfo:     { fontSize: 13, color: '#64748b', padding: '0 8px' },
};