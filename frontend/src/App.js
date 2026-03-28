import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PermissionProvider } from './context/PermissionContext';
import './App.css';
// Client pages
import ClientReclamation from './pages/client/Reclamation';
import SuiviReclamation from './pages/client/SuiviReclamation';
import Historique from './pages/client/Historique';
import Dashboard from './pages/client/Dashboard';

// CRM pages
import CRMDashboard from './pages/crm/Dashboard';
import Clients from './pages/crm/Clients';
import Factures from './pages/crm/Factures';
import Reclamations from './pages/crm/Reclamations';
import Interventions from './pages/crm/Interventions';
import Offres from './pages/crm/Offres';
import Statistiques from './pages/crm/Statistiques';

// CRM Administration pages
import Profils from './pages/crm/administration/Profils';
import Employes from './pages/crm/administration/Employes';
import Permissions from './pages/crm/administration/Permissions';
import Parametres from './pages/crm/administration/Parametres';

export default function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/client/dashboard" replace />} />

            {/* Pages Client */}
            <Route path="/client/reclamation" element={<ClientReclamation />} />
            <Route path="/client/suivi" element={<SuiviReclamation />} />
            <Route path="/client/historique" element={<Historique />} />
            <Route path="/client/dashboard" element={<Dashboard />} />

            {/* Pages CRM */}
            <Route path="/crm/dashboard" element={<CRMDashboard />} />
            <Route path="/crm/clients" element={<Clients />} />
            <Route path="/crm/factures" element={<Factures />} />
            <Route path="/crm/reclamations" element={<Reclamations />} />
            <Route path="/crm/interventions" element={<Interventions />} />
            <Route path="/crm/offres" element={<Offres />} />
            <Route path="/crm/statistiques" element={<Statistiques />} />

            {/* CRM Administration */}
            <Route path="/crm/administration/profils" element={<Profils />} />
            <Route path="/crm/administration/employes" element={<Employes />} />
            <Route path="/crm/administration/permissions" element={<Permissions />} />
            <Route path="/crm/administration/parametres" element={<Parametres />} />

            {/* Page 404 */}
            <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </PermissionProvider>
    </AuthProvider>
  );
}