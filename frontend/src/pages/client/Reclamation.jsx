import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Phone, BookOpen,
  ChevronLeft, FileText, Wrench, Globe, Send, X, Activity, Check, Clock
} from 'lucide-react';
import ClientLayoutFixed from '../../layouts/clientLayoutFixed';
import ClientTopNav from '../../components/client/ClientTopNav';
import { reclamationsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import TypeModal from '../../components/client/reclamationTypeModal';
import { MdSignalWifiStatusbarConnectedNoInternet3 } from 'react-icons/md';
import axios from 'axios';

const API = 'http://localhost:5000';

const ICON_MAP = {
  internet:    <MdSignalWifiStatusbarConnectedNoInternet3 size={28} />,
  telephonie:  <Phone size={28} />,
  fttx:        <Activity size={28} />,
  equipement:  <Wrench size={28} />,
  facturation: <FileText size={28} />,
  service:     <Globe size={28} />,
};

const COLOR_FIXED = '#061a2e';

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', bg: '#FFF3E0', color: '#E65100' },
  en_cours:   { label: 'En cours',   bg: '#E3F2FD', color: '#1565C0' },
  resolue:    { label: 'Résolue',    bg: '#E8F5E9', color: '#2E7D32' },
  fermee:     { label: 'Fermée',     bg: '#F3F4F6', color: '#6B7280' },
};

const StatusBadge = ({ statut }) => {
  const cfg = STATUS_CONFIG[statut] || { label: statut, bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
};

export default function ClientReclamation() {
  const { client } = useAuth();

  // ── Catégories dynamiques ─────────────────────────────────────────────────
  const [categories,  setCategories]  = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/categories-reclamation`)
      .then(res => setCategories(res.data.map(cat => ({
        ...cat,
        icon:  ICON_MAP[cat.iconKey] || <Globe size={28} />,
        color: COLOR_FIXED,
      }))))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, []);

  // ── Réclamations ──────────────────────────────────────────────────────────
  const [reclamations, setReclamations] = useState([]);
  const [loadingRec,   setLoadingRec]   = useState(true);

  const fetchReclamations = async () => {
    if (!client?.id) return;
    try {
      const res = await reclamationsAPI.getAll({ client_id: client.id });
      const liste = res?.data?.data || [];
      setReclamations(liste.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch { setReclamations([]); }
    finally { setLoadingRec(false); }
  };

  useEffect(() => { fetchReclamations(); }, [client?.id]);

  // ── Formulaire ────────────────────────────────────────────────────────────
  const [modalCat,      setModalCat]      = useState(null);
  const [selectedCat,   setSelectedCat]   = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [form, setForm] = useState({
    nom: client?.nom || '', prenom: client?.prenom || '',
    telephone: client?.telephone || '', adresse: client?.adresse || '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const setField           = (n, v) => { setForm(f => ({ ...f, [n]: v })); if (error) setError(''); };
  const handleCatClick     = (cat)   => setModalCat(cat);
  const handleModalConfirm = (types) => { setSelectedCat(modalCat); setSelectedTypes(types); setModalCat(null); };
  const handleModalClose   = ()      => setModalCat(null);
  const handleBack         = ()      => { setSelectedCat(null); setSelectedTypes([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || form.description.length < 10) {
      setError('Veuillez décrire votre problème (minimum 10 caractères).');
      return;
    }
    setLoading(true);
    try {
      await reclamationsAPI.create({
        client_id:        client?.id,
        titre:            selectedCat.label.toUpperCase(),
        description:      `Types: ${selectedTypes.join(', ')} | Contact: ${form.prenom} ${form.nom} | Tel: ${form.telephone} | Obs: ${form.description}`,
        type_probleme:    selectedTypes.join(' / '),
        adresse_probleme: form.adresse,
      });
      setSuccess(true);
      setForm(prev => ({ ...prev, description: '' }));
      setSelectedCat(null); setSelectedTypes([]);
      await fetchReclamations();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur réseau. Veuillez réessayer plus tard.');
    } finally { setLoading(false); }
  };

  return (
    // ✅ ClientLayoutFixed : main-content-fixed = height 100vh, overflow hidden
    // Complètement isolé du ClientLayout normal utilisé par les autres pages
    <ClientLayoutFixed>
      <TypeModal category={modalCat} onConfirm={handleModalConfirm} onClose={handleModalClose} />

      <div style={{
        height: '109%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '42px 24px',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>

          <ClientTopNav
            title={selectedCat ? 'Détails du problème' : 'Nouvelle Réclamation'}
            subtitle={selectedCat ? `Catégorie : ${selectedCat.label}` : 'Sélectionnez une catégorie pour signaler un incident'}
          />

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: 10, padding: '10px 16px', color: '#3B6D11', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                ✓ Réclamation envoyée avec succès.
                <button onClick={() => setSuccess(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#3B6D11' }}>
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">

              {!selectedCat && (
                <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#455061', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                      Nouvelle réclamation — choisissez une catégorie
                    </p>
                    {loadingCats ? (
                      <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: 13 }}>Chargement des catégories...</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {categories.map((cat) => (
                          <div key={cat.id} className="category-card" style={{ cursor: 'pointer', padding: '14px 12px' }} onClick={() => handleCatClick(cat)}>
                            <div style={{ color: cat.color, background: cat.bg, borderRadius: 12, padding: 10, display: 'inline-flex' }}>{cat.icon}</div>
                            <h3 className="ds-service-label" style={{ marginTop: 10, fontSize: 12 }}>{cat.label}</h3>
                            <p className="reclamation-form-sub" style={{ fontSize: 10, margin: 0 }}>{cat.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {!loadingRec && reclamations.length > 0 && (
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#455061', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                        Mes réclamations récentes
                      </p>
                      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
                        {reclamations.map((rec) => (
                          <div key={rec.id} style={{ minWidth: 260, flexShrink: 0, background: 'white', borderRadius: 14, border: '1px solid #F0F2F4', padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>{rec.titre}</span>
                              <StatusBadge statut={rec.statut} />
                            </div>
                            {rec.type_probleme && <span style={{ fontSize: 11, color: '#64748B' }}>{rec.type_probleme}</span>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8' }}>
                              <Clock size={11} />
                              {new Date(rec.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {selectedCat && (
                <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, height: '100%' }}>

                  <div className="at-card reclamation-left" style={{ background: '#F8FAFB', padding: '20px 16px', overflow: 'hidden' }}>
                    <div style={{ color: selectedCat.color, background: selectedCat.bg, borderRadius: 12, padding: 10, display: 'inline-flex', marginBottom: 10 }}>{selectedCat.icon}</div>
                    <h2 className="reclamation-form-title" style={{ color: selectedCat.color, fontSize: 15, margin: '0 0 6px' }}>{selectedCat.label}</h2>
                    <p className="reclamation-form-sub" style={{ textAlign: 'center', marginBottom: 10, fontSize: 12 }}>Incident lié à {selectedCat.label.toLowerCase()}.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%', marginBottom: 4 }}>
                      {selectedTypes.map((t) => (
                        <div key={t} style={{ background: `${selectedCat.color}12`, border: `1px solid ${selectedCat.color}40`, borderRadius: 6, padding: '4px 8px', fontSize: 10, color: selectedCat.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={10} /> {t}
                        </div>
                      ))}
                    </div>
                    <div className="reclamation-left-divider" style={{ marginTop: 12 }}>
                      <p className="reclamation-left-assist-title">Aide immédiate</p>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button className="reclamation-call-btn"><Phone size={12} /> 12</button>
                        <button className="reclamation-call-btn"><Phone size={12} /> 100</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button onClick={() => setModalCat(selectedCat)} style={{ background: 'none', border: `1px solid ${selectedCat.color}`, color: selectedCat.color, borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>Modifier les types</button>
                      <button onClick={handleBack} style={{ border: 'none', background: 'transparent', color: '#718096', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><ChevronLeft size={14} /> Retour</button>
                    </div>
                  </div>

                  <div className="at-card" style={{ padding: '24px 28px', overflow: 'hidden' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {error && <div className="reclamation-error" style={{ fontSize: 12, padding: '8px 12px' }}>{error}</div>}
                      <div className="reclamation-input-row">
                        <div className="reclamation-input-line"><User size={16} color="#CBD5E1" /><input placeholder="Nom" value={form.nom} onChange={e => setField('nom', e.target.value)} required /></div>
                        <div className="reclamation-input-line"><User size={16} color="#CBD5E1" /><input placeholder="Prénom" value={form.prenom} onChange={e => setField('prenom', e.target.value)} required /></div>
                      </div>
                      <div className="reclamation-input-line"><Phone size={16} color="#CBD5E1" /><input placeholder="Téléphone" value={form.telephone} onChange={e => setField('telephone', e.target.value)} required /></div>
                      <div className="reclamation-input-line"><MapPin size={16} color="#CBD5E1" /><input placeholder="Adresse d'installation" value={form.adresse} onChange={e => setField('adresse', e.target.value)} required /></div>
                      <div className="reclamation-input-line" style={{ alignItems: 'flex-start' }}><BookOpen size={16} color="#CBD5E1" style={{ marginTop: 5 }} /><textarea placeholder="Décrivez votre problème..." value={form.description} onChange={e => setField('description', e.target.value)} required style={{ height: 60 }} /></div>
                      <button type="submit" disabled={loading} className="reclamation-submit" style={{ background: selectedCat.color }}>
                        {loading ? 'ENVOI EN COURS...' : <><Send size={14} /> ENVOYER LA RÉCLAMATION</>}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </ClientLayoutFixed>
  );
}