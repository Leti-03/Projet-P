import React, { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../../layouts/ClientLayout';
import CarteRecap from '../../components/crm/dashboard/CarteRecap';
import { 
  Search, Star, Tag, Zap, RefreshCw, User, MoreVertical, ArrowRight 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // On utilise ton context mis à jour

export default function CatalogueClient() {
  const { client } = useAuth(); // Récupération du client (ou 'user')
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadOffres = useCallback(async () => {
    if (!client?.id) return;
    setLoading(true);
    try {
      // Appel à ton API de filtrage intelligent
      const res = await axios.get(`http://localhost:5000/api/offres/client/${client.id}`);
      setOffres(res.data || []);
    } catch (e) {
      console.error("Erreur chargement catalogue:", e);
    } finally {
      setLoading(false);
    }
  }, [client?.id]);

  useEffect(() => { loadOffres(); }, [loadOffres]);

  const filteredOffres = offres.filter(o => 
    o.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ClientLayout>
      <div className="animate-page" style={{ padding: '25px' }}>
        
        {/* Header avec Profil Dynamique (Identique à Historique) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 className="at-title">Promotions & Offres</h1>
            <p className="at-subtitle">Des solutions exclusives adaptées à votre profil</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <button 
                className="at-tab-btn" 
                onClick={loadOffres} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid var(--at-border)', padding: '8px 15px', cursor: 'pointer' }}
             >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
             </button>
             
             <div className="client-topnav-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1' }}>
                    {client?.nom} {client?.prenom}
                  </div>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>ID: {client?.id?.slice(0,8)}</small>
                </div>
                <div style={{ 
                  width: '38px', height: '38px', borderRadius: '12px', 
                  background: 'var(--at-green)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', color: 'white',
                  boxShadow: '0 4px 10px rgba(76, 175, 80, 0.2)'
                }}>
                  <User size={20} />
                </div>
             </div>
          </div>
        </div>

        {/* Statistiques Dynamiques (Adaptées aux offres) */}
        <div className="at-grid" style={{ marginBottom: '30px' }}>
          <CarteRecap titre="Disponibles" valeur={offres.length} icone={Tag} couleur="var(--at-green)" />
          <CarteRecap titre="Exclusivités" valeur={offres.filter(o => o.cible_status?.length > 0).length} icone={Star} couleur="#3182ce" />
          <CarteRecap titre="Haut Débit" valeur={offres.filter(o => o.debit?.includes('100')).length} icone={Zap} couleur="var(--at-orange)" />
        </div>

        {/* Barre de recherche (Identique à Historique) */}
        <div className="at-card" style={{ marginBottom: '20px', padding: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
              <input 
                className="at-input" 
                placeholder="Rechercher une offre (Fibre, ADSL...)" 
                style={{ width: '100%', paddingLeft: '40px' }} 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Liste des Offres (Même structure que ton tableau Historique) */}
        <div className="at-card" style={{ padding: '0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Analyse de votre éligibilité...</div>
          ) : filteredOffres.length > 0 ? (
            filteredOffres.map((offre, idx) => (
              <div key={idx} className="at-table-row" style={{ display: 'flex', alignItems: 'center', padding: '18px 25px', borderBottom: '1px solid #f1f5f9' }}>
                
                {/* Infos Offre */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{offre.nom}</div>
                    {offre.cible_status?.length > 0 && (
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>Exclusif</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Débit: {offre.debit_internet || offre.debit} • Engagement 12 mois
                  </div>
                </div>

                {/* Prix */}
                <div style={{ marginRight: '40px', textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: 'var(--at-blue)', fontSize: '18px' }}>{offre.prix} DA</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>TTC / mois</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        style={{ 
                            background: 'var(--at-green)', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 18px', 
                            borderRadius: '8px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        Souscrire <ArrowRight size={14}/>
                    </button>
                    <button style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                        <MoreVertical size={18}/>
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Tag size={40} style={{ color: '#cbd5e1', marginBottom: '15px' }} />
              <div style={{ color: '#94a3b8' }}>Aucune offre promotionnelle ne correspond à votre profil.</div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}