import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const SegmentationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const clientId = state?.clientId;

  const [form, setForm] = useState({
    interet: "",
    budget: "",
    // Tes nouvelles questions de statut
    etudiant: false,
    parent: false,
    retraite: false,
    salarie: false,
    entrepreneur: false,
    tags_bruts: "" // Pour la saisie texte
  });

  const handleFinish = async (e) => {
    e.preventDefault();
    
    // On prépare l'objet final comme tu le souhaites
    const profil_segment = {
      interet: form.interet,
      budget: form.budget,
      etudiant: form.etudiant,
      parent: form.parent,
      retraite: form.retraite,
      salarie: form.salarie,
      entrepreneur: form.entrepreneur,
      // On transforme la chaîne "prof, medecin" en ["prof", "medecin"]
      tags_personnalises: form.tags_bruts.split(',').map(t => t.trim()).filter(t => t !== "")
    };

    try {
      await axios.put(`http://localhost:5000/api/clients/${clientId}/segment`, {
        profil_segment
      });
      navigate("/login", { state: { message: "Profil configuré avec succès !" } });
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6F9", padding: "20px" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "#fff", padding: 30, borderRadius: 20, width: "100%", maxWidth: 500 }}>
        <h2 style={{ color: "#0070B8", textAlign: "center" }}>Personnalisation</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 20 }}>Dites-nous en plus sur vous</p>
        
        <form onSubmit={handleFinish} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          
          {/* Section Statuts (Checkboxes) */}
          <label style={{ fontWeight: "bold", fontSize: 14 }}>Votre situation (plusieurs choix possibles) :</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "#f9f9f9", padding: 15, borderRadius: 10 }}>
            {["etudiant", "parent", "retraite", "salarie", "entrepreneur"].map(status => (
              <label key={status} style={{ fontSize: 13, textTransform: "capitalize", display: "flex", alignItems: "center", gap: 8 }}>
                <input 
                  type="checkbox" 
                  checked={form[status]} 
                  onChange={e => setForm({...form, [status]: e.target.checked})} 
                />
                {status.replace('etudiant', 'Étudiant').replace('salarie', 'Salarié')}
              </label>
            ))}
          </div>

          {/* Section Tags */}
          <label style={{ fontWeight: "bold", fontSize: 14 }}>Profession ou centres d'intérêt (Tags) :</label>
          <input 
            type="text" 
            placeholder="Ex: Médecin, Artiste, Gamer..." 
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            value={form.tags_bruts}
            onChange={e => setForm({...form, tags_bruts: e.target.value})}
          />
          <small style={{ color: "#999", marginTop: -10 }}>Séparez les mots par des virgules</small>

          {/* Reste du formulaire */}
          <label style={{ fontWeight: "bold", fontSize: 14 }}>Intérêt principal :</label>
          <select required style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }} onChange={e => setForm({...form, interet: e.target.value})}>
            <option value="">Sélectionner...</option>
            <option value="Fibre">Fibre Optique</option>
            <option value="ADSL">ADSL / VDSL</option>
            <option value="Mobile">Forfait Mobile</option>
          </select>

          <button type="submit" style={{ marginTop: 10, padding: 12, background: "#78BE20", color: "#fff", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" }}>
            Valider mon profil
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SegmentationPage;