import React, { useState, useEffect } from 'react';
import Layout from '../../components/crm/common/Layout';
import axios from 'axios';

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // État pour la nouvelle offre (Ciblage inclus)
  const [newOffre, setNewOffre] = useState({
    nom: '', prix: '', debit: '', description: '',
    type_offre: 'tous', // 'grand_public', 'corporate', 'tous'
    cible_status: [] // etudiant, salarie, etc.
  });

  // Chargement des offres depuis le Backend
  const fetchOffres = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/offres');
      setOffres(res.data);
    } catch (err) {
      console.error("Erreur chargement offres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffres(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/offres', newOffre);
      setShowModal(false);
      fetchOffres(); // Rafraîchir la liste
    } catch (err) { alert("Erreur lors de la création"); }
  };

  const toggleCible = (val) => {
    setNewOffre(prev => ({
      ...prev,
      cible_status: prev.cible_status.includes(val)
        ? prev.cible_status.filter(i => i !== val)
        : [...prev.cible_status, val]
    }));
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="at-title" style={{ margin: 0 }}>Catalogue des Offres</h1>
        <button 
          className="at-btn at-btn-primary" 
          onClick={() => setShowModal(true)}
          style={{ background: 'var(--at-green)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Ajouter une offre
        </button>
      </div>
      
      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {offres.map(offre => (
            <div key={offre.id} className="at-card" style={{ padding: '20px', borderTop: '4px solid var(--at-green)', position: 'relative' }}>
               {/* Badge de ciblage discret */}
               {offre.type_offre !== 'tous' && (
                 <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', background: '#eee', padding: '2px 8px', borderRadius: '10px' }}>
                   {offre.type_offre.toUpperCase()}
                 </span>
               )}
               
               <h3 style={{ margin: '0 0 10px 0' }}>{offre.nom}</h3>
               <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: 'var(--at-blue)' }}>{offre.prix} DA</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                 <span style={{ color: 'var(--at-text-sub)', fontSize: '14px' }}><b>Débit:</b> {offre.debit_internet || offre.debit}</span>
                 {offre.cible_status?.length > 0 && (
                   <span style={{ fontSize: '12px', color: 'var(--at-green)' }}>🎯 Cible: {offre.cible_status.join(', ')}</span>
                 )}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL D'AJOUT (Style épuré) */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleCreate} className="at-card" style={{ width: '400px', padding: '30px', background: 'white' }}>
            <h2 style={{ marginBottom: '20px' }}>Nouvelle Offre</h2>
            
            <input className="at-input" placeholder="Nom de l'offre" onChange={e => setNewOffre({...newOffre, nom: e.target.value})} required style={{ marginBottom: '15px', width: '100%' }} />
            <input className="at-input" placeholder="Prix (ex: 5000)" type="number" onChange={e => setNewOffre({...newOffre, prix: e.target.value})} required style={{ marginBottom: '15px', width: '100%' }} />
            <input className="at-input" placeholder="Débit (ex: 100 Mbps)" onChange={e => setNewOffre({...newOffre, debit: e.target.value})} style={{ marginBottom: '15px', width: '100%' }} />

            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Ciblage par Statut :</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '10px 0 15px 0' }}>
              {['etudiant', 'salarie', 'entrepreneur', 'parent'].map(s => (
                <span 
                  key={s} 
                  onClick={() => toggleCible(s)}
                  style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: '15px', fontSize: '11px', border: '1px solid', borderColor: newOffre.cible_status.includes(s) ? 'var(--at-green)' : '#ccc', background: newOffre.cible_status.includes(s) ? 'var(--at-green)' : 'transparent', color: newOffre.cible_status.includes(s) ? 'white' : '#666' }}
                >
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="at-btn at-btn-primary" style={{ flex: 1, background: 'var(--at-blue)', color: 'white' }}>Enregistrer</button>
              <button type="button" onClick={() => setShowModal(false)} className="at-btn" style={{ flex: 1 }}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}