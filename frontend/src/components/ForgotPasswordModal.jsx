// src/components/ForgotPasswordModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      // Endpoint à créer côté backend si nécessaire
      const res = await fetch(`${BASE_URL}/api/clients/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setStatus("success");
      setMessage("Un lien de réinitialisation a été envoyé sur votre email.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  const handleClose = () => {
    setEmail("");
    setStatus("idle");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 100,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101,
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 24px 64px rgba(0,112,184,0.18)",
              width: "90%", maxWidth: 400,
              overflow: "hidden",
              fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0070B8, #004f85)",
                padding: "22px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ color: "#fff", margin: 0, fontSize: 17, fontWeight: 800 }}>
                  Mot de passe oublié ?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 12 }}>
                  Nous vous enverrons un lien de réinitialisation
                </p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none", color: "#fff",
                  width: 30, height: 30, borderRadius: "50%",
                  cursor: "pointer", fontSize: 16, lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Barre */}
            <div style={{ height: 3, background: "linear-gradient(to right, #0070B8, #78BE20)" }} />

            {/* Corps */}
            <div style={{ padding: "24px 24px 20px" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <p style={{ color: "#78BE20", fontWeight: 700, fontSize: 14, margin: "0 0 8px 0" }}>
                    Email envoyé !
                  </p>
                  <p style={{ color: "#7f8c8d", fontSize: 13 }}>{message}</p>
                  <button
                    onClick={handleClose}
                    style={{
                      marginTop: 16, padding: "10px 28px",
                      background: "#0070B8", color: "#fff",
                      border: "none", borderRadius: 8,
                      fontWeight: 700, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 13,
                    }}
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p style={{ color: "#7f8c8d", fontSize: 13, marginBottom: 16 }}>
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>

                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setMessage(""); setStatus("idle"); }}
                    required
                    style={{
                      width: "100%", padding: "11px 14px",
                      border: "2px solid #d1dae3", borderRadius: 10,
                      fontSize: 13, outline: "none",
                      fontFamily: "inherit", color: "#2C3E50",
                      boxSizing: "border-box", marginBottom: 12,
                    }}
                  />

                  {status === "error" && (
                    <p style={{ color: "#E2001A", fontSize: 12, marginBottom: 12 }}>
                      ⚠️ {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !email}
                    style={{
                      width: "100%", padding: "12px 0",
                      background: status === "loading" ? "#7f8c8d" : "#0070B8",
                      color: "#fff", border: "none", borderRadius: 10,
                      fontSize: 14, fontWeight: 700,
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {status === "loading" ? "Envoi..." : "Envoyer le lien"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;