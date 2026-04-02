import { createContext, useState, useEffect, useCallback, useContext } from "react";
// 1. IMPORTATION MANQUANTE ICI :
import authClientAPI, { apiLogin, apiRegister } from "../services/authClient";

export const AuthContext = createContext(null);

// --- AJOUT DU HOOK useAuth POUR CORRIGER L'ERREUR ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

const CLIENT_KEY = "at_client";
const TOKEN_KEY = "at_token"; // Clé pour le JWT

export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au chargement
  useEffect(() => {
    const storedClient = localStorage.getItem(CLIENT_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedClient && storedToken) {
      try {
        setClient(JSON.parse(storedClient));
        // On remet le token dans les headers axios par défaut
        authClientAPI.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch {
        localStorage.removeItem(CLIENT_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  // --- LOGIN ---
  const login = useCallback(async ({ email, password }) => {
    // On envoie un payload simple (ce que ton backend reçoit déjà)
    const payload = { 
      email: email.toLowerCase().trim(), 
      password 
    };

    const data = await apiLogin(payload);

    if (data && data.token) {
      // 1. Mise à jour de l'état
      setClient(data.client);
      
      // 2. Stockage local
      localStorage.setItem(CLIENT_KEY, JSON.stringify(data.client));
      localStorage.setItem(TOKEN_KEY, data.token);

      // 3. Configuration d'Axios pour les prochaines requêtes (Réclamations, etc.)
      authClientAPI.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    return data;
  }, []);

  // --- LOGOUT ---
  const logout = useCallback(() => {
    setClient(null);
    localStorage.removeItem(CLIENT_KEY);
    localStorage.removeItem(TOKEN_KEY);
    delete authClientAPI.defaults.headers.common['Authorization'];
  }, []);

  // --- REGISTER ---
  const register = useCallback(async (formData) => {
    const parts = formData.username.trim().split(/\s+/);
    const firstName = parts[0] || "Client";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "Inconnu";

    const payload = {
      nom: lastName,
      prenom: firstName,
      email: formData.email.toLowerCase().trim(),
      telephone: formData.telephone || "0000000000",
      mot_de_passe: formData.password,
      confirm_mot_de_passe: formData.passwordConfirm,
      date_naissance: null,
      carte_identite_url: ""
    };

    return await apiRegister(payload);
  }, []);

  return (
    <AuthContext.Provider value={{ client, user: client, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};