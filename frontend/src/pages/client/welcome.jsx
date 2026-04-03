// src/pages/Welcome.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo.algtc.png";
import { BiSolidOffer } from "react-icons/bi";
import { MdMessage, MdReportProblem  } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #e8f4fc 0%, #f0f7ff 40%, #e4f2e8 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Cercles concentriques centraux ── */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -52%)",
        pointerEvents: "none", zIndex: 0,
      }}>
        {[600, 480, 370, 270, 180].map((size, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            style={{
              position: "absolute",
              width: size, height: size,
              borderRadius: "50%",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, rgba(0,160,100,${0.04 + i * 0.025}) 0%, rgba(0,112,184,${0.03 + i * 0.015}) 60%, transparent 100%)`,
              border: `1px solid rgba(0,140,80,${0.07 + i * 0.025})`,
            }}
          />
        ))}
      </div>

      {/* Blobs coins */}
      <div style={{ position: "absolute", top: -120, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,112,184,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,190,32,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative", zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 56px",
        }}
      >
        {/* Logo réel */}
        <motion.img
          src={logo}
          alt="Algérie Télécom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ height: 52, objectFit: "contain" }}
        />

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {["Services", "Offres", "Support", "À propos"].map((item) => (
            <a key={item} href="#" style={{
              color: "#2d4a6e", fontSize: 14, fontWeight: 500,
              textDecoration: "none", opacity: 0.75,
            }}>
              {item}
            </a>
          ))}
        </div>

        {/* CTA nav */}
        <motion.button
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "transparent", color: "#0070B8",
            border: "1.5px solid rgba(0,112,184,0.35)",
            borderRadius: 50, padding: "9px 24px",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          Connexion
          
        </motion.button>
      </motion.nav>

      {/* ── Hero central ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "50px 24px 40px",
        minHeight: "calc(100vh - 90px)",
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ marginBottom: 24 }}
        >
          {/* <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,140,80,0.2)",
            color: "#007850", borderRadius: 50,
            padding: "7px 18px", fontSize: 13, fontWeight: 600,
            boxShadow: "0 2px 16px rgba(0,120,80,0.1)",
          }}> */}
            {/* <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#78BE20", display: "inline-block", boxShadow: "0 0 6px #78BE20" }} />
            Nouveau — Suivi de réclamation en temps réel */}
          {/* </span> */}
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(34px, 5.5vw, 64px)",
            fontWeight: 900, color: "#0d2d4a",
            lineHeight: 1.1, letterSpacing: -2,
            margin: "0 0 18px 0", maxWidth: 720,
          }}
        >
          Vos services télécom,{" "}
          <span style={{
            background: "linear-gradient(135deg, #0070B8, #78BE20)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            tout en un
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.55 }}
          style={{
            color: "#4a6a8a", fontSize: 17, lineHeight: 1.65,
            maxWidth: 460, margin: "0 0 40px 0",
          }}
        >
          Gérez vos abonnements, suivez vos réclamations et accédez à vos factures depuis votre espace client personnel.
        </motion.p>

        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46, duration: 0.5 }}
          style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 56 }}
        >
          <motion.button
            onClick={() => navigate("/register")}
            whileHover={{ scale: 1.05, boxShadow: "0 12px 36px rgba(0,112,184,0.28)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg, #0070B8, #005a93)",
              color: "#fff", border: "none", borderRadius: 50,
              padding: "15px 36px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 6px 24px rgba(0,112,184,0.22)",
            }}
          >
            Créer mon espace client
          </motion.button>

          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "rgba(255,255,255,0.75)",
              color: "#0070B8", border: "1.5px solid rgba(0,112,184,0.2)",
              borderRadius: 50, padding: "14px 30px",
              fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            J'ai déjà un compte 
          </motion.button>
        </motion.div>

        {/* Cartes features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.6 }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}
        >
          {[
            { icon: <BiSolidOffer />, title: "Offres", desc: "Offres personnaliser", color: "rgba(0,112,184,0.08)", border: "rgba(0,112,184,0.15)" },
            { icon: <MdMessage />, title: "Messagerie", desc: "Restez en contact avec nos agents", color: "rgba(120,190,32,0.08)", border: "rgba(120,190,32,0.2)" },
            { icon: <MdReportProblem />, title: "Réclamations", desc: "Suivez en temps réel", color: "rgba(0,160,100,0.07)", border: "rgba(0,160,100,0.15)" },
            { icon: <IoIosNotifications />, title: "Facturation", desc: "Historique & Rappel", color: "rgba(0,112,184,0.06)", border: "rgba(0,112,184,0.12)" },
          ].map((card, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, i % 2 === 0 ? -6 : -4, 0] }}
              transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(16px)",
                border: `1.5px solid ${card.border}`,
                borderRadius: 20, padding: "18px 22px",
                minWidth: 150, maxWidth: 175,
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                textAlign: "left",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: card.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 12,
              }}>
                {card.icon}
              </div>
              <p style={{ color: "#0d2d4a", fontWeight: 700, fontSize: 13, margin: "0 0 3px 0" }}>{card.title}</p>
              <p style={{ color: "#6a8aaa", fontSize: 12, margin: 0, lineHeight: 1.4 }}>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            display: "flex", marginTop: 48,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(0,112,184,0.1)",
            borderRadius: 20, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {[
            { val: "2M+", label: "Clients actifs" },
            { val: "99.9%", label: "Disponibilité" },
            { val: "48h", label: "Délai traitement" },
            { val: "24/7", label: "Support en ligne" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "16px 30px", textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(0,112,184,0.1)" : "none",
            }}>
              <p style={{ color: "#0070B8", fontSize: 20, fontWeight: 900, margin: "0 0 2px 0", letterSpacing: -0.5 }}>{s.val}</p>
              <p style={{ color: "#7a9ab8", fontSize: 11, margin: 0, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          position: "absolute", bottom: 18, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 28, zIndex: 20,
        }}
      >
        {["CGU", "Confidentialité", "Support", `© ${new Date().getFullYear()} Algérie Télécom`].map((t, i) => (
          <span key={i} style={{ color: "rgba(45,74,110,0.4)", fontSize: 12, cursor: i < 3 ? "pointer" : "default" }}>{t}</span>
        ))}
      </motion.div>
    </div>
  );
};

export default Welcome;