import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiVerifyOTP, apiResendOTP } from "../../services/authClient";

const RESEND_DELAY = 60;

const OtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Récupération sécurisée des infos
  const email = state?.email || "";
  const type = state?.type || "register";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      console.error("Pas d'email trouvé dans le state ! Redirection...");
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- LA FONCTION DE SOUMISSION CORRIGÉE ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = otp.join("");
    
    if (code.length < 6) return;
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = { 
        email: email.toLowerCase().trim(), 
        otp: code 
    };

    console.log("🚀 Envoi vérification:", payload);

    try {
      const res = await apiVerifyOTP(payload);
      setSuccess(res.message || "Vérification réussie !");
      
      // FIX: On récupère l'ID envoyé par le serveur (vérifie si c'est res.id ou res.user.id)
      const clientId = res.user?.id || res.id || res.clientId;

      setTimeout(() => {
        navigate("/segmentation", { 
          replace: true, 
          state: { 
            clientId: clientId, // Maintenant clientId est bien défini
            type: type 
          } 
        });
      }, 1500);
    } catch (err) {
      console.error("❌ Erreur OTP:", err.response?.data);
      setError(err.response?.data?.error || "Code invalide ou expiré.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit quand c'est plein
  useEffect(() => {
    if (otp.every(digit => digit !== "")) {
      handleSubmit();
    }
  }, [otp]);

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await apiResendOTP({ email });
      setSuccess("Nouveau code envoyé !");
      setCanResend(false);
      setCountdown(RESEND_DELAY);
    } catch (err) {
      setError("Erreur lors du renvoi.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6F9" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "#fff", padding: 40, borderRadius: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400, textAlign: "center" }}>
        <h2 style={{ color: "#0070B8" }}>Vérification</h2>
        <p style={{ fontSize: 13, color: "#666" }}>Code envoyé à : <b>{email}</b></p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{ width: 45, height: 50, textAlign: "center", fontSize: 20, border: "2px solid #ddd", borderRadius: 8 }}
              />
            ))}
          </div>

          {error && <p style={{ color: "red", fontSize: 13 }}>⚠️ {error}</p>}
          {success && <p style={{ color: "green", fontSize: 13 }}>✅ {success}</p>}

          <button 
            type="submit" 
            disabled={loading || otp.join("").length < 6}
            style={{ width: "100%", padding: 12, background: "#0070B8", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
          >
            {loading ? "Vérification..." : "Vérifier"}
          </button>
        </form>

        <div style={{ marginTop: 20 }}>
            {canResend ? (
                <button onClick={handleResend} style={{ color: "#78BE20", border: "none", background: "none", cursor: "pointer", textDecoration: "underline" }}>Renvoyer le code</button>
            ) : (
                <span style={{ fontSize: 12, color: "#999" }}>Renvoyer dans {countdown}s</span>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPage;