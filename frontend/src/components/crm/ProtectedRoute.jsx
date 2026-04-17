import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/crm/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, hasPermission, hasRole } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
            <rect width="120" height="120" rx="24" fill="#FFFFFF" stroke="#006837" strokeWidth="2" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
              fill="#006837" fontSize="44" fontWeight="900" fontFamily="serif" letterSpacing="-2">AT</text>
            <rect x="20" y="85" width="80" height="6" rx="3" fill="#006837" />
          </svg>
          <p style={{ marginTop: 12, color: "#006837", fontWeight: 600, fontSize: 13 }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false && loading === false) {
    return <Navigate to="/crm/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
