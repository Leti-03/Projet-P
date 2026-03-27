import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';   // ← doit correspondre exactement

// Client pages
import ClientReclamation from './pages/client/Reclamation';
import SuiviReclamation from './pages/client/SuiviReclamation';
import Historique from './pages/client/Historique';
// import Welcome from "./pages/welcome.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/client/historique" replace />} />

          {/* Pages Client */}
          <Route path="/client/reclamation" element={<ClientReclamation />} />
          <Route path="/client/suivi"       element={<SuiviReclamation />} />
          <Route path="/client/historique"  element={<Historique />} />

          {/* Page 404 */}
          <Route path="*" element={<Navigate to="/client/historique" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}