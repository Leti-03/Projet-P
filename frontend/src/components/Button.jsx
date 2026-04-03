// src/components/Button.jsx
import { motion } from "framer-motion";

const Button = ({ label, onClick, type = "button", disabled = false, variant = "primary" }) => {
  const bg = {
    primary: disabled ? "#90caf9" : "#0070B8",
    outline: "transparent",
    green: "#78BE20",
  }[variant] || "#0070B8";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.015, boxShadow: "0 6px 22px rgba(0,112,184,0.32)" } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      style={{
        width: "100%",
        padding: "13px 0",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        background: bg,
        color: variant === "outline" ? "#0070B8" : "#fff",
        border: variant === "outline" ? "2px solid #0070B8" : "none",
        fontFamily: "inherit",
        letterSpacing: 0.3,
        transition: "background 0.2s",
      }}
    >
      {label}
    </motion.button>
  );
};

export default Button;