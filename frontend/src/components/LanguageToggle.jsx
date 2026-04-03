// src/components/LanguageToggle.jsx
// Composant basique FR / AR — branchez i18next si vous l'avez
import { useState } from "react";

const LanguageToggle = () => {
  const [lang, setLang] = useState("fr");

  const toggle = () => {
    const next = lang === "fr" ? "ar" : "fr";
    setLang(next);
    // Si vous utilisez i18next :
    // import i18n from '../i18n'; i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  return (
    <button
      onClick={toggle}
      title="Changer la langue"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        background: "rgba(0,112,184,0.08)",
        border: "1.5px solid rgba(0,112,184,0.2)",
        borderRadius: 20,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: "#0070B8",
        fontFamily: "inherit",
        transition: "background 0.2s",
      }}
    >
      <span style={{ fontSize: 14 }}>{lang === "fr" ? "🇩🇿" : "🇫🇷"}</span>
      {lang === "fr" ? "AR" : "FR"}
    </button>
  );
};

export default LanguageToggle;