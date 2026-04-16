// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Enveloppe une route protégée.
 * Si le client n'est pas connecté → redirige vers /login
 * Usage dans App.jsx :
 *   <Route path="/client/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { client, loading } = useAuth();

  if (loading) {
    // Splash minimaliste pendant la rehydration du localStorage
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6F9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
            <rect width="120" height="120" rx="24" fill="#0070B8" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
              fill="white" fontSize="44" fontWeight="900" fontFamily="serif" letterSpacing="-2">AT</text>
            <rect x="20" y="85" width="80" height="6" rx="3" fill="#78BE20" />
          </svg>
          <p style={{ marginTop: 12, color: "#0070B8", fontWeight: 600, fontSize: 13 }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!client) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;