// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaLock, FaEnvelope, FaPhone, FaIdCard,
  FaVenusMars, FaPassport
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import FormCard from "../../components/FormCard.jsx";
import InputField from "../../components/InputField.jsx";
import Button from "../../components/Button.jsx";
import LanguageToggle from "../../components/LanguageToggle.jsx";

// ── Hook responsive ───────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

// ── SelectField — même style que InputField (underline only) ──────────────────
const SelectField = ({ icon, name, value, onChange, options, placeholder }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 22, width: "100%" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        borderBottom: `2px solid ${focused ? "#0070B8" : "#e2e8f0"}`,
        paddingBottom: 8,
        gap: 10,
        transition: "border-color 0.2s",
      }}>
        {icon && (
          <span style={{ color: focused ? "#0070B8" : "#a0aec0", fontSize: 14, flexShrink: 0, transition: "color 0.2s" }}>
            {icon}
          </span>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14,
            color: value ? "#1a202c" : "#a0aec0",
            background: "transparent",
            fontFamily: "inherit",
            padding: 0,
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        >
          <option value="" disabled hidden style={{ color: "#a0aec0" }}>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} style={{ color: "#1a202c" }}>{opt.label}</option>
          ))}
        </select>
        <span style={{ color: "#a0aec0", fontSize: 10, flexShrink: 0, pointerEvents: "none" }}>▼</span>
      </div>
    </div>
  );
};

// ── Panneau gauche ────────────────────────────────────────────────────────────
const LeftFeatures = () => (
  <div>
    <h2 style={{ color: "#505a69", fontSize: 18, fontWeight: 800, lineHeight: 1.35, margin: "0 0 4px 0" }}>
      Créez votre compte{" "}
      <span style={{ color: "#78BE20" }}>Algérie Télécom</span>
    </h2>
    <p style={{ color: "#505a69", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
      Rejoignez des milliers de clients qui gèrent leurs services en ligne.
    </p>
  </div>
);

// ── Page Register ─────────────────────────────────────────────────────────────
const Register = () => {
  const navigate   = useNavigate();
  const { register } = useAuth();
  const isMobile   = useIsMobile();

  const [formData, setFormData] = useState({
    username: "", email: "", telephone: "", password: "", passwordConfirm: "",
    sexe: "", num_certificat: "", type_document: ""
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm) {
      setError("Tous les champs obligatoires doivent être remplis."); return;
    }
    if (formData.username.trim().length < 3) { setError("Le nom doit contenir au moins 3 caractères."); return; }
    if (formData.password.length < 8)        { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (formData.password !== formData.passwordConfirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (!acceptTerms) { setError("Vous devez accepter les conditions d'utilisation."); return; }
    if (!formData.num_certificat.trim()) { setError("Veuillez saisir votre numéro de certificat."); return; }

    setLoading(true);
    try {
      await register(formData);
      navigate("/OtpPage", {
        state: { email: formData.email, type: "register", redirectTo: "/client/dashboard" }
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard leftContent={<LeftFeatures />} topRight={<LanguageToggle />}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#505a69", margin: "0 0 10px 0" }}>Créer un compte</h2>
      <p style={{ color: "#718096", fontSize: 13, margin: "0 0 45px 0" }}>Rejoignez le portail Algérie Télécom</p>

      <form onSubmit={handleSubmit}>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "0" : "0 32px",
        }}>

          {/* ── Colonne gauche : Nom, Email, Téléphone, Sexe ── */}
          <div>
            <InputField type="text" name="username" placeholder="Nom complet (ex: Ahmed Benali)"
              icon={<FaUser />} value={formData.username} onChange={handleChange} />

            <InputField type="email" name="email" placeholder="Adresse e-mail"
              icon={<FaEnvelope />} value={formData.email} onChange={handleChange} />

            <InputField type="text" name="telephone" placeholder="Téléphone (optionnel)"
              icon={<FaPhone />} value={formData.telephone} onChange={handleChange} />

            <SelectField
              name="sexe"
              icon={<FaVenusMars />}
              placeholder="Sexe"
              value={formData.sexe}
              onChange={handleChange}
              options={[
                { value: "masculin", label: "Masculin" },
                { value: "feminin",  label: "Féminin"  },
              ]}
            />
          </div>

          {/* ── Colonne droite : Type pièce, N° certificat, MDP, Confirmer ── */}
          <div>
            <SelectField
              name="type_document"
              icon={<FaIdCard />}
              placeholder="Type de pièce d'identité"
              value={formData.type_document}
              onChange={handleChange}
              options={[
                { value: "carte_identite", label: "Carte d'identité" },
                { value: "passeport",      label: "Passeport"        },
              ]}
            />

            <InputField
              type="text"
              name="num_certificat"
              placeholder={
                formData.type_document === "passeport"      ? "Numéro de passeport" :
                formData.type_document === "carte_identite" ? "Numéro de carte d'identité" :
                "Numéro de certificat"
              }
              icon={formData.type_document === "passeport" ? <FaPassport /> : <FaIdCard />}
              value={formData.num_certificat}
              onChange={handleChange}
            />

            <InputField type="password" name="password" placeholder="Mot de passe (min. 8)"
              icon={<FaLock />} value={formData.password} onChange={handleChange} />

            <InputField type="password" name="passwordConfirm" placeholder="Confirmer le mot de passe"
              icon={<FaLock />} value={formData.passwordConfirm} onChange={handleChange} />
          </div>

        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
            <p style={{ color: "#c53030", fontSize: 12, margin: 0 }}>⚠️ {error}</p>
          </motion.div>
        )}

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
              style={{ marginTop: 3, width: 14, height: 14, accentColor: "#0070B8", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.5 }}>
              J'accepte les{" "}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"
                style={{ color: "#0070B8", fontWeight: 600, textDecoration: "underline" }}>
                Conditions d'Utilisation
              </a>
            </span>
          </label>
        </div>

        <Button type="submit" label={loading ? "Création..." : "Créer mon compte"} disabled={loading} />
      </form>

      <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#718096" }}>
        Déjà un compte ?{" "}
        <a href="/login" style={{ color: "#0070B8", fontWeight: 700, textDecoration: "none" }}>Se connecter</a>
      </p>
      <p style={{ textAlign: "center", marginTop: 4, fontSize: 11 }}>
        <a href="/welcome" style={{ color: "#78BE20", fontWeight: 600, textDecoration: "none" }}>← Retour à l'accueil</a>
      </p>
    </FormCard>
  );
};

export default Register;