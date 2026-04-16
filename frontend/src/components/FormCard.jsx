// src/components/FormCard.jsx
import { motion } from "framer-motion";
import logo from "../assets/logo.algtc.png";

const FormCard = ({ leftContent, children, topRight }) => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#eef2f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 880,
          minHeight: 560,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.06)", 
        }}
      >
        {/* ── Panneau gauche ── */}
        <div style={{
          width: "42%",
          // CHANGEMENT : Fond gris clair
          background: "#f8fafc", 
          padding: "44px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          borderRight: "1px solid #e2e8f0",
          // CHANGEMENT : Force le texte en noir/sombre
          color: "#1e293b", 
        }}>
          {/* Déco cercles */}
          <div style={{ position: "absolute", top: -70, right: -70, width: 240, height: 240, borderRadius: "50%", background: "rgba(120,190,32,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(0,112,184,0.06)", pointerEvents: "none" }} />

          <div />

          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}
          >
            <motion.img
              src={logo}
              alt="Algérie Télécom"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "85%",
                maxWidth: 200,
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
              }}
            />
          </motion.div>

          {/* ── Texte + features en bas ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ 
              position: "relative", 
              zIndex: 1, 
              width: "100%",
              // On s'assure que tout texte injecté ici soit bien visible
              color: "#1e293b" 
            }}
          >
            {/* Si leftContent contient des balises p ou h, on s'assure de leur couleur */}
            <div style={{ color: "inherit" }}>
              {leftContent}
            </div>

            {/* Copyright */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <div style={{ width: 32, height: 3, background: "#78BE20", borderRadius: 2, marginBottom: 8 }} />
              <p style={{ color: "#94a3b8", fontSize: 11, margin: 0 }}>
                © {new Date().getFullYear()} Algérie Télécom
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Panneau droit blanc ── */}
        <div style={{
          flex: 1,
          background: "#ffffff",
          padding: "44px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}>
          {topRight && (
            <div style={{ position: "absolute", top: 20, right: 24 }}>{topRight}</div>
          )}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormCard;