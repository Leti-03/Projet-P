// src/components/InputField.jsx
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({ type, name, placeholder, icon, value, onChange, onFocus, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

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
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          style={{
            flex: 1, border: "none", outline: "none",
            fontSize: 14, color: "#1a202c",
            background: "transparent", fontFamily: "inherit",
            padding: 0,
          }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            style={{ background: "none", border: "none", color: "#a0aec0", cursor: "pointer", padding: 0, flexShrink: 0 }}
            aria-label={showPassword ? "Masquer" : "Afficher"}
          >
            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;