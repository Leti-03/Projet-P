// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaWifi, FaPhone, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import FormCard from "../../components/FormCard.jsx";
import InputField from "../../components/InputField.jsx";
import Button from "../../components/Button.jsx";
import LanguageToggle from "../../components/LanguageToggle.jsx";
import ForgotPasswordModal from "../../components/ForgotPasswordModal.jsx";

// ── Features affichées en bas du panneau gauche ───────────────────────────────
const LeftFeatures = () => (
  <div>
    <h2 style={{ color: "#505a69", fontSize: 20, fontWeight: 800, lineHeight: 1.35, margin: "0 0 6px 0" }}>
      Bienvenue sur votre{" "}
      <span style={{ color: "#78BE20" }}>Espace Client</span>
    </h2>
    <p style={{ color: "#505a69", fontSize: 13, lineHeight: 1.6, margin: "0 0 18px 0" }}>
      Gérez vos services Algérie Télécom en toute simplicité, 24h/24.
    </p>
    {[
      // { icon: <FaWifi size={11} />, label: "Internet & ADSL" },
      // { icon: <FaPhone size={11} />, label: "Téléphonie fixe" },
      // { icon: <FaFileAlt size={11} />, label: "Suivi réclamations" },
    ].map((f, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 + i * 0.1 }}
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: "rgba(120,190,32,0.18)",
          border: "1px solid rgba(120,190,32,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#78BE20", flexShrink: 0,
        }}>
          {f.icon}
        </div>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{f.label}</span>
      </motion.div>
    ))}
  </div>
);

// ── Page Login ────────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const clearError   = () => { if (error) setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { setError("Veuillez remplir tous les champs."); return; }
    setError(""); setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate("/client/dashboard");
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("vérifier votre email")) {
        setError("Compte non vérifié. Redirection...");
        setTimeout(() => navigate("/OtpPage", { state: { email: formData.email, type: "register", redirectTo: "/client/dashboard" } }), 1500);
      } else if (msg.includes("Identifiants") || msg.includes("incorrect")) {
        setError("Email ou mot de passe incorrect.");
      } else if (msg.includes("désactivé")) {
        setError("Compte désactivé. Contactez le support.");
      } else {
        setError(msg || "Erreur de connexion. Réessayez.");
      }
    } finally { setLoading(false); }
  };

  return (
    <>
      <FormCard leftContent={<LeftFeatures />} topRight={<LanguageToggle />}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#505a69", margin: "0 0 4px 0" }}>Connexion</h2>
        <p style={{ color: "#718096", fontSize: 14, margin: "0 0 30px 0" }}>Accédez à votre espace client</p>

        <form onSubmit={handleSubmit}>
          <InputField
            type="email" name="email"
            placeholder="Adresse e-mail ou téléphone"
            icon={<FaEnvelope />}
            value={formData.email} onChange={handleChange} onFocus={clearError}
          />
          <InputField
            type="password" name="password"
            placeholder="Mot de passe"
            icon={<FaLock />}
            value={formData.password} onChange={handleChange} onFocus={clearError}
          />

          <div style={{ textAlign: "right", marginBottom: 22, marginTop: -8 }}>
            <button type="button" onClick={() => setIsModalOpen(true)}
              style={{ background: "none", border: "none", color: "#0070B8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Mot de passe oublié ?
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ color: "#c53030", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
            </motion.div>
          )}

          <Button type="submit" label={loading ? "Connexion..." : "Se connecter"} disabled={loading} />
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#718096" }}>
          Pas encore de compte ?{" "}
          <a href="/register" style={{ color: "#0070B8", fontWeight: 700, textDecoration: "none" }}>S'inscrire</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 12 }}>
          <a href="/welcome" style={{ color: "#78BE20", fontWeight: 600, textDecoration: "none" }}>← Retour à l'accueil</a>
        </p>
      </FormCard>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Login;