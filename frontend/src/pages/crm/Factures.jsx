import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getFactures, createFacture, updateStatutFacture,
  envoyerFacture, downloadPDF, searchClients,
} from '../../services/crm/factures.js';

// ── Constantes ──────────────────────────────────────────────────────────────
const STATUT_STYLE = {
  impayee:  { bg: '#FFF8EC', color: '#D97706', dot: '#F59E0B' },
  payee:    { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
  en_retard:{ bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
  annulee:  { bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
};

const STATUTS = ['impayee', 'payee', 'en_retard', 'annulee'];

// ── Composant badge statut ──────────────────────────────────────────────────
function StatutBadge({ statut }) {
  const st = STATUT_STYLE[statut] || STATUT_STYLE.annulee;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:999, background:st.bg, color:st.color, fontSize:11, fontWeight:700 }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:st.dot, flexShrink:0 }} />
      {statut.replace('_', ' ')}
    </span>
  );
}

// ── Modal de confirmation ────────────────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }) {
  return (
    <div className="at-modal-overlay" onClick={onCancel}>
      <div style={{ background:'white', borderRadius:20, padding:32, maxWidth:420, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.2)', animation:'slideUp .22s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:36, textAlign:'center', marginBottom:12 }}>{danger ? '⚠️' : '💬'}</div>
        <h3 style={{ textAlign:'center', fontSize:17, fontWeight:700, color:'#1A202C', margin:'0 0 8px' }}>{title}</h3>
        <p style={{ textAlign:'center', fontSize:14, color:'#718096', margin:'0 0 28px', lineHeight:1.6 }}>{message}</p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'11px', borderRadius:10, border:'1px solid var(--at-border)', background:'white', fontSize:14, fontWeight:600, cursor:'pointer', color:'#374151' }}>Annuler</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background: danger ? '#EF4444' : 'var(--at-green)', color:'white', fontSize:14, fontWeight:700, cursor:'pointer' }}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

// ── Recherche client avec autocomplete ──────────────────────────────────────
function ClientSearch({ value, onChange }) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const timerRef                = useRef(null);
  const wrapRef                 = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (val) => {
    setQuery(val);
    if (!value) return; // si déjà sélectionné, effacer si on retape
    clearTimeout(timerRef.current);
    if (val.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchClients(val);
        setResults(data);
        setOpen(true);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 300);
  };

  const select = (client) => {
    onChange(client);
    setQuery(`${client.prenom} ${client.nom} — ${client.email}`);
    setOpen(false);
    setResults([]);
  };

  const clear = () => { onChange(null); setQuery(''); setResults([]); setOpen(false); };

  return (
    <div ref={wrapRef} style={{ position:'relative' }}>
      <div style={{ display:'flex', alignItems:'center', border:'1px solid var(--at-border)', borderRadius:10, background:'#FAFBFC', overflow:'hidden', transition:'border .2s' }}>
        <span style={{ padding:'0 12px', color:'#94A3B8', fontSize:16 }}>🔍</span>
        <input
          value={query}
          onChange={e => handleInput(e.target.value)}
          placeholder="Rechercher par nom, téléphone, email, ville, code client..."
          style={{ flex:1, padding:'12px 0', border:'none', background:'transparent', fontSize:14, outline:'none', color:'#1A202C' }}
        />
        {loading && <span style={{ padding:'0 12px', fontSize:12, color:'#94A3B8' }}>⏳</span>}
        {value && <button onClick={clear} style={{ padding:'0 14px', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', fontSize:18 }}>✕</button>}
      </div>

      {open && results.length > 0 && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'white', borderRadius:12, boxShadow:'0 12px 32px rgba(0,0,0,0.12)', border:'1px solid var(--at-border)', zIndex:100, maxHeight:320, overflowY:'auto' }}>
          {results.map(c => (
            <div key={c.id} onClick={() => select(c)} style={{ padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #F0F2F4', transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background='#F7FAFC'}
              onMouseLeave={e => e.currentTarget.style.background='white'}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#1A202C' }}>{c.prenom} {c.nom}</div>
                  <div style={{ fontSize:12, color:'#718096', marginTop:2 }}>{c.email} {c.telephone ? `• ${c.telephone}` : ''}</div>
                  {(c.ville || c.wilaya) && <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>📍 {[c.commune, c.ville, c.wilaya].filter(Boolean).join(', ')}</div>}
                </div>
                <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                  {c.code_client && <div style={{ fontSize:11, background:'var(--at-green-light)', color:'var(--at-green)', padding:'2px 8px', borderRadius:6, fontWeight:600 }}>{c.code_client}</div>}
                  {c.categorie && <div style={{ fontSize:10, color:'#94A3B8', marginTop:4, textTransform:'uppercase' }}>{c.categorie}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.length >= 2 && !loading && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'white', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', border:'1px solid var(--at-border)', zIndex:100, padding:'20px', textAlign:'center', color:'#94A3B8', fontSize:13 }}>
          Aucun client trouvé pour "{query}"
        </div>
      )}
    </div>
  );
}

// ── Composant fiche client sélectionné ──────────────────────────────────────
function ClientCard({ client }) {
  if (!client) return null;
  const rows = [
    ['Email', client.email],
    ['Téléphone', client.telephone],
    ['Adresse', [client.adresse, client.commune, client.daira, client.wilaya].filter(Boolean).join(', ')],
    ['Code client', client.code_client],
    ['N° compte AT', client.numero_compte_at],
    ['Entreprise', client.nom_entreprise],
    ['Catégorie', client.categorie],
    ['Statut compte', client.statut_compte],
  ].filter(([, v]) => v);

  return (
    <div style={{ background:'var(--at-green-light)', border:'1px solid #A7F3D0', borderRadius:12, padding:'14px 16px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:'#14532D' }}>{client.prenom} {client.nom}</div>
          {client.nom_entreprise && <div style={{ fontSize:12, color:'#166534' }}>{client.nom_entreprise}</div>}
        </div>
        {client.categorie && (
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', background:'white', color:'var(--at-green)', padding:'3px 10px', borderRadius:6, border:'1px solid #A7F3D0' }}>{client.categorie}</span>
        )}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px' }}>
        {rows.map(([label, val]) => (
          <div key={label} style={{ fontSize:12 }}>
            <span style={{ color:'#166534', fontWeight:600 }}>{label} : </span>
            <span style={{ color:'#14532D' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────────────────────
export default function Factures() {
  const [factures, setFactures]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [filterStatut, setFilter]   = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [toast, setToast]           = useState(null);
  const [busy, setBusy]             = useState(false);

  // Formulaire
  const [clientSel, setClientSel]   = useState(null);
  const [dates, setDates]           = useState({ date_echeance:'', periode_debut:'', periode_fin:'' });
  const [lignes, setLignes]         = useState([{ description:'', quantite:1, prix_unitaire:'' }]);

  const limit = 20;

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const charger = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFactures({ statut: filterStatut, page, limit });
      setFactures(res.data || []);
      setTotal(res.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterStatut, page]);

  useEffect(() => { charger(); }, [charger]);

  // Lignes
  const addLigne    = () => setLignes(l => [...l, { description:'', quantite:1, prix_unitaire:'' }]);
  const removeLigne = (i) => setLignes(l => l.filter((_, idx) => idx !== i));
  const setLigne    = (i, k, v) => setLignes(l => { const n=[...l]; n[i]={...n[i],[k]:v}; return n; });

  const ht  = lignes.reduce((s,l) => s + (parseFloat(l.prix_unitaire)||0)*(parseFloat(l.quantite)||0), 0);
  const ttc = ht * 1.19;
  const totalPages = Math.ceil(total / limit);

  // KPIs page courante
  const kpi = {
    total,
    impayees:  factures.filter(f => f.statut === 'impayee').length,
    retard:    factures.filter(f => f.statut === 'en_retard').length,
    revenu:    factures.filter(f => f.statut === 'payee').reduce((s,f) => s + parseFloat(f.montant_ttc||0), 0),
  };

  const askConfirm = (title, message, fn, danger = false) =>
    setConfirm({ title, message, onConfirm: fn, danger });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!clientSel) return showToast('error', 'Veuillez sélectionner un client');
    setBusy(true);
    try {
      await createFacture({ client_id: clientSel.id, lignes, ...dates });
      showToast('success', '✅ Facture créée avec succès');
      setShowModal(false);
      setClientSel(null);
      setLignes([{ description:'', quantite:1, prix_unitaire:'' }]);
      setDates({ date_echeance:'', periode_debut:'', periode_fin:'' });
      charger();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Erreur création');
    } finally { setBusy(false); }
  };

  const handleStatut = (id, statut, label) => {
    askConfirm(
      `Marquer comme "${label}" ?`,
      `Cette action va changer le statut de la facture.`,
      async () => {
        setConfirm(null);
        try {
          await updateStatutFacture(id, statut);
          showToast('success', `Facture marquée ${label}`);
          charger();
          if (showDetail?.id === id) setShowDetail(p => ({...p, statut}));
        } catch { showToast('error', 'Erreur mise à jour'); }
      },
      statut === 'annulee'
    );
  };

  const handleEnvoyer = (f) => {
    askConfirm(
      'Envoyer par email ?',
      `La facture ${f.numero_facture} sera envoyée à ${f.clients?.email}.`,
      async () => {
        setConfirm(null); setBusy(true);
        try {
          const res = await envoyerFacture(f.id);
          showToast('success', res.message || 'Email envoyé ✅');
        } catch { showToast('error', "Erreur envoi email"); }
        finally { setBusy(false); }
      }
    );
  };

  const handleDownload = async (f) => {
    try { await downloadPDF(f.id, f.numero_facture); }
    catch { showToast('error', 'Erreur téléchargement PDF'); }
  };

  return (
    <div className="animate-page" style={{ padding:'32px 32px 48px', maxWidth:1400, margin:'0 auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:9999, background: toast.type==='success' ? '#006837' : '#DC2626', color:'white', padding:'14px 20px', borderRadius:12, fontSize:14, fontWeight:600, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', animation:'slideInUp .3s ease', display:'flex', alignItems:'center', gap:10 }}>
          {toast.text}
          <button onClick={() => setToast(null)} style={{ background:'none', border:'none', color:'white', cursor:'pointer', fontSize:16, marginLeft:4 }}>✕</button>
        </div>
      )}

      {/* Confirm modal */}
      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <h1 className="at-title">Facturation</h1>
          <p className="at-subtitle">{total} facture(s) au total</p>
        </div>
        <button className="at-btn-green" style={{ width:'auto', padding:'12px 24px', borderRadius:12 }} onClick={() => setShowModal(true)}>
          + Nouvelle facture
        </button>
      </div>

      {/* KPIs */}
      <div className="at-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:28 }}>
        {[
          { label:'Total',      value:total,                       color:'#3B82F6', icon:'📋' },
          { label:'Impayées',   value:kpi.impayees,                color:'#F59E0B', icon:'⏳' },
          { label:'En retard',  value:kpi.retard,                  color:'#EF4444', icon:'🚨' },
          { label:'Revenus',    value:`${kpi.revenu.toFixed(0)} DZD`, color:'#22C55E', icon:'💰' },
        ].map((k,i) => (
          <div key={i} className="at-card" style={{ borderLeft:`4px solid ${k.color}`, padding:'18px 20px' }}>
            <div style={{ fontSize:22 }}>{k.icon}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#1A202C', margin:'6px 0 2px' }}>{k.value}</div>
            <div style={{ fontSize:12, color:'var(--at-text-sub)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:8, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <button onClick={() => { setFilter(''); setPage(1); }}
          style={{ padding:'7px 16px', borderRadius:999, border:'none', fontSize:12, fontWeight:600, cursor:'pointer', background: filterStatut==='' ? '#1A1A1A' : '#E5E7EB', color: filterStatut==='' ? 'white' : '#475569' }}>
          Toutes
        </button>
        {STATUTS.map(st => {
          const sty = STATUT_STYLE[st];
          const active = filterStatut === st;
          return (
            <button key={st} onClick={() => { setFilter(st); setPage(1); }}
              style={{ padding:'7px 16px', borderRadius:999, border:'none', fontSize:12, fontWeight:600, cursor:'pointer', background: active ? sty.dot : '#E5E7EB', color: active ? 'white' : '#475569', boxShadow: active ? `0 3px 10px ${sty.dot}44` : 'none' }}>
              {st.replace('_',' ')}
            </button>
          );
        })}
      </div>

      {/* Tableau */}
      {loading ? (
        <div style={{ padding:64, textAlign:'center', color:'var(--at-text-sub)', fontSize:16 }}>⏳ Chargement...</div>
      ) : (
        <div className="at-card" style={{ padding:0, overflow:'auto', borderRadius:20 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFB' }}>
                {['N° Facture','Client','Période','HT','TVA','TTC','Échéance','Statut','Actions'].map(h => (
                  <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--at-text-sub)', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'1px solid var(--at-border)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factures.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:56, color:'#94A3B8' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                  <div style={{ fontSize:15, fontWeight:600 }}>Aucune facture</div>
                </td></tr>
              ) : factures.map(f => {
                const ht  = parseFloat(f.montant_ht || 0);
                const ttc = parseFloat(f.montant_ttc || 0);
                const tva = ttc - ht;
                const ech = f.date_echeance ? new Date(f.date_echeance) : null;
                const tard = ech && ech < new Date() && f.statut === 'impayee';
                return (
                  <tr key={f.id} style={{ borderBottom:'1px solid #F0F2F4', background: tard ? '#FFF8F8' : 'white', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = tard ? '#FFF0F0' : '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = tard ? '#FFF8F8' : 'white'}>
                    <td style={{ padding:'14px 16px' }}>
                      <span onClick={() => setShowDetail(f)} style={{ fontWeight:800, color:'var(--at-green)', cursor:'pointer', fontSize:13, textDecoration:'underline', textDecorationColor:'#A7F3D0' }}>{f.numero_facture}</span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ fontWeight:700, fontSize:13, color:'#1A202C' }}>{f.clients?.prenom} {f.clients?.nom}</div>
                      <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{f.clients?.email}</div>
                      {f.clients?.telephone && <div style={{ fontSize:11, color:'#CBD5E1' }}>{f.clients.telephone}</div>}
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:12, color:'#718096' }}>
                      {f.periode_debut && f.periode_fin
                        ? <>{new Date(f.periode_debut).toLocaleDateString('fr-DZ')}<br/><span style={{ color:'#CBD5E1' }}>→</span> {new Date(f.periode_fin).toLocaleDateString('fr-DZ')}</>
                        : <span style={{ color:'#CBD5E1' }}>—</span>}
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'#374151' }}>{ht.toFixed(2)}</td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'#374151' }}>{tva.toFixed(2)}</td>
                    <td style={{ padding:'14px 16px' }}><strong style={{ fontSize:14, color:'#1A202C' }}>{ttc.toFixed(2)} DZD</strong></td>
                    <td style={{ padding:'14px 16px', fontSize:12 }}>
                      {ech ? <span style={{ color: tard ? '#DC2626' : '#374151', fontWeight: tard ? 700 : 400 }}>{tard ? '🚨 ' : ''}{ech.toLocaleDateString('fr-DZ')}</span> : <span style={{ color:'#CBD5E1' }}>—</span>}
                    </td>
                    <td style={{ padding:'14px 16px' }}><StatutBadge statut={f.statut} /></td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                        <button onClick={() => handleDownload(f)} style={btnSm('#1A1A1A')} title="PDF">📄</button>
                        <button onClick={() => handleEnvoyer(f)} disabled={busy} style={btnSm('#3B82F6')} title="Email">📧</button>
                        {f.statut === 'impayee' && <>
                          <button onClick={() => handleStatut(f.id,'payee','payée')} style={btnSm('#22C55E')} title="Payée">✅</button>
                          <button onClick={() => handleStatut(f.id,'en_retard','en retard')} style={btnSm('#F59E0B')} title="En retard">⚠️</button>
                          <button onClick={() => handleStatut(f.id,'annulee','annulée')} style={btnSm('#9CA3AF')} title="Annuler">🚫</button>
                        </>}
                        {f.statut === 'en_retard' && <button onClick={() => handleStatut(f.id,'payee','payée')} style={btnSm('#22C55E')}>✅</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:24, alignItems:'center' }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={btnSm('#1A1A1A', page===1 ? 0.4 : 1)}>← Préc.</button>
          <span style={{ fontSize:13, color:'#718096', padding:'0 12px' }}>Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={btnSm('#1A1A1A', page===totalPages ? 0.4 : 1)}>Suiv. →</button>
        </div>
      )}

      {/* ── Modal Création ────────────────────────────────────────────────── */}
      {showModal && (
        <div className="at-modal-overlay" onClick={() => setShowModal(false)}>
          <div style={{ background:'white', borderRadius:24, padding:36, width:'100%', maxWidth:720, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.2)', animation:'slideUp .25s ease' }} onClick={e => e.stopPropagation()}>

            {/* Header modal */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <div>
                <h2 style={{ fontSize:22, fontWeight:800, color:'#1A202C', margin:'0 0 4px' }}>Nouvelle Facture</h2>
                <p style={{ fontSize:13, color:'#718096', margin:0 }}>Remplissez les informations ci-dessous</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width:36, height:36, borderRadius:10, border:'1px solid var(--at-border)', background:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#64748B' }}>✕</button>
            </div>

            <form onSubmit={handleCreate}>
              {/* Section client */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#718096', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>👤 Client *</div>
                <ClientSearch value={clientSel} onChange={setClientSel} />
                {clientSel && <div style={{ marginTop:10 }}><ClientCard client={clientSel} /></div>}
              </div>

              {/* Section dates */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#718096', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>📅 Dates</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  {[['date_echeance',"Date d'échéance"],['periode_debut','Période début'],['periode_fin','Période fin']].map(([k,l]) => (
                    <div key={k}>
                      <label style={{ fontSize:11, fontWeight:600, color:'#4A5568', display:'block', marginBottom:5 }}>{l}</label>
                      <input type="date" value={dates[k]} onChange={e => setDates(d => ({...d,[k]:e.target.value}))}
                        style={{ width:'100%', padding:'10px 12px', border:'1px solid var(--at-border)', borderRadius:10, fontSize:13, outline:'none', background:'#FAFBFC', boxSizing:'border-box' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section lignes */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#718096', textTransform:'uppercase', letterSpacing:'0.5px' }}>📋 Lignes de facturation *</div>
                  <button type="button" onClick={addLigne} style={{ ...btnSm('#3B82F6'), padding:'6px 14px', fontSize:12 }}>+ Ajouter</button>
                </div>
                <div style={{ background:'#F8FAFB', borderRadius:12, padding:16 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'3fr 80px 120px 36px', gap:8, marginBottom:8 }}>
                    {['Désignation','Qté','Prix HT (DZD)',''].map((h,i) => (
                      <div key={i} style={{ fontSize:10, fontWeight:700, color:'#94A3B8', textTransform:'uppercase' }}>{h}</div>
                    ))}
                  </div>
                  {lignes.map((l, i) => (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'3fr 80px 120px 36px', gap:8, marginBottom:8 }}>
                      <input placeholder="Ex: Abonnement Fibre 100 Mb/s" value={l.description}
                        onChange={e => setLigne(i,'description',e.target.value)} required
                        style={{ padding:'10px 12px', border:'1px solid var(--at-border)', borderRadius:8, fontSize:13, outline:'none', background:'white' }} />
                      <input type="number" min="1" value={l.quantite}
                        onChange={e => setLigne(i,'quantite',e.target.value)} required
                        style={{ padding:'10px 8px', border:'1px solid var(--at-border)', borderRadius:8, fontSize:13, outline:'none', background:'white', textAlign:'center' }} />
                      <input type="number" min="0" step="0.01" placeholder="0.00" value={l.prix_unitaire}
                        onChange={e => setLigne(i,'prix_unitaire',e.target.value)} required
                        style={{ padding:'10px 12px', border:'1px solid var(--at-border)', borderRadius:8, fontSize:13, outline:'none', background:'white', textAlign:'right' }} />
                      <button type="button" onClick={() => removeLigne(i)} disabled={lignes.length===1}
                        style={{ width:36, height:40, borderRadius:8, border:'none', background: lignes.length===1 ? '#F0F0F0' : '#FEE2E2', color: lignes.length===1 ? '#CBD5E1' : '#DC2626', cursor: lignes.length===1 ? 'not-allowed' : 'pointer', fontSize:14 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div style={{ background:'#006837', borderRadius:14, padding:'18px 22px', marginBottom:24, color:'white' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, opacity:0.8 }}>
                  <span>Montant HT</span><span>{ht.toFixed(2)} DZD</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:13, opacity:0.8 }}>
                  <span>TVA (19%)</span><span>{(ttc-ht).toFixed(2)} DZD</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:20, fontWeight:800, borderTop:'1px solid rgba(255,255,255,0.25)', paddingTop:12 }}>
                  <span>Total TTC</span><span>{ttc.toFixed(2)} DZD</span>
                </div>
              </div>

              {/* Boutons */}
              <div style={{ display:'flex', gap:12 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex:1, padding:13, borderRadius:12, border:'1px solid var(--at-border)', background:'white', fontSize:14, fontWeight:600, cursor:'pointer', color:'#374151' }}>Annuler</button>
                <button type="submit" disabled={busy || !clientSel} style={{ flex:2, padding:13, borderRadius:12, border:'none', background: (!clientSel||busy) ? '#9CA3AF' : 'var(--at-green)', color:'white', fontSize:14, fontWeight:700, cursor: (!clientSel||busy) ? 'not-allowed' : 'pointer' }}>
                  {busy ? '⏳ Création...' : '✅ Créer la facture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Détail ─────────────────────────────────────────────────── */}
      {showDetail && (
        <div className="at-modal-overlay" onClick={() => setShowDetail(null)}>
          <div style={{ background:'white', borderRadius:24, padding:32, width:'100%', maxWidth:560, maxHeight:'88vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'#1A202C' }}>{showDetail.numero_facture}</div>
                <div style={{ marginTop:6 }}><StatutBadge statut={showDetail.statut} /></div>
              </div>
              <button onClick={() => setShowDetail(null)} style={{ width:34, height:34, borderRadius:10, border:'1px solid var(--at-border)', background:'white', cursor:'pointer', fontSize:16, color:'#64748B' }}>✕</button>
            </div>

            {showDetail.clients && (
              <div style={{ background:'#F8FAFB', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Client</div>
                <div style={{ fontWeight:800, fontSize:15 }}>{showDetail.clients.prenom} {showDetail.clients.nom}</div>
                {showDetail.clients.email && <div style={{ fontSize:13, color:'#718096', marginTop:3 }}>{showDetail.clients.email}</div>}
                {showDetail.clients.telephone && <div style={{ fontSize:13, color:'#718096' }}>📞 {showDetail.clients.telephone}</div>}
              </div>
            )}

            <div style={{ background:'#F8FAFB', borderRadius:12, padding:'14px 16px', marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Montants</div>
              {[
                ['Montant HT', `${parseFloat(showDetail.montant_ht||0).toFixed(2)} DZD`],
                [`TVA (${showDetail.tva}%)`, `${(parseFloat(showDetail.montant_ttc||0)-parseFloat(showDetail.montant_ht||0)).toFixed(2)} DZD`],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'5px 0', borderBottom:'1px solid #F0F2F4' }}>
                  <span style={{ color:'#718096' }}>{l}</span><span style={{ color:'#374151' }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:17, fontWeight:800, paddingTop:10 }}>
                <span>Total TTC</span><span style={{ color:'var(--at-green)' }}>{parseFloat(showDetail.montant_ttc||0).toFixed(2)} DZD</span>
              </div>
            </div>

            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={() => handleDownload(showDetail)} style={btnSm('#1A1A1A')}>📄 PDF</button>
              <button onClick={() => handleEnvoyer(showDetail)} disabled={busy} style={btnSm('#3B82F6')}>📧 Envoyer</button>
              {showDetail.statut !== 'payee' && showDetail.statut !== 'annulee' && (
                <button onClick={() => { handleStatut(showDetail.id,'payee','payée'); }} style={btnSm('#22C55E')}>✅ Marquer payée</button>
              )}
              {showDetail.statut === 'impayee' && (
                <button onClick={() => { handleStatut(showDetail.id,'annulee','annulée'); setShowDetail(null); }} style={btnSm('#9CA3AF')}>🚫 Annuler</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnSm = (bg, opacity = 1) => ({
  padding: '7px 13px',
  background: bg,
  color: 'white',
  border: 'none',
  borderRadius: 8,
  fontSize: 12,
  cursor: opacity < 1 ? 'not-allowed' : 'pointer',
  opacity,
  whiteSpace: 'nowrap',
  fontWeight: 600,
});