import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';   // ← doit correspondre exactement

// Client pages
import ClientReclamation from './pages/client/Reclamation';
import SuiviReclamation from './pages/client/SuiviReclamation';
import Historique from './pages/client/Historique';
import Dashboard from './pages/client/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/client/dashboard" replace />} />

          {/* Pages Client */}
          <Route path="/client/reclamation" element={<ClientReclamation />} />
          <Route path="/client/suivi"       element={<SuiviReclamation />} />
          <Route path="/client/historique"  element={<Historique />} />
          <Route path="/client/dashboard" element={<Dashboard />} />


          {/* Page 404 */}
          <Route path="*" element={<Navigate to="/client/historique" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}