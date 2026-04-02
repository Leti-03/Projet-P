// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { PermissionProvider } from './context/PermissionContext';
import './App.css';

// ── Pages auth ───────────────────────────────────────────────────────────────
import Welcome  from "./pages/client/welcome.jsx";
import Login    from "./pages/client/Login.jsx";
import Register from "./pages/client/Register.jsx";
import OtpPage  from "./pages/client/OtpPage.jsx";

// ── Pages client ─────────────────────────────────────────────────────────────
import Dashboard         from "./pages/client/Dashboard";
import ClientReclamation from "./pages/client/Reclamation";
import SuiviReclamation  from "./pages/client/SuiviReclamation";
import Historique        from "./pages/client/Historique";
import SegmentationPage  from "./pages/client/SegmentationPage.jsx";
import Promotions        from "./pages/client/offreclient.jsx";
import DemandeService    from './pages/client/demandeService.jsx';
import MesDemandes       from './pages/client/mesDemande.jsx';

// ── Pages CRM ────────────────────────────────────────────────────────────────
import CRMDashboard  from './pages/crm/Dashboard';
import Clients       from './pages/crm/Clients';
import Factures      from './pages/crm/Factures';
import Reclamations  from './pages/crm/Reclamations';
import Interventions from './pages/crm/Interventions';
import Offres        from './pages/crm/Offres';
import Statistiques  from './pages/crm/Statistiques';
import Assignation   from './pages/crm/Assignation';
import ClientDetail  from './pages/crm/ClientDetail.jsx';

// ── Pages Demandes de service ─────────────────────────────────────────────────
import DemandesCategories from './pages/crm/DemandesCategories';
import DemandesListe      from './pages/crm/DemandesListe';
import DemandeDetail      from './pages/crm/DemandeDetail';

// ── CRM Administration ────────────────────────────────────────────────────────
import Profils     from './pages/crm/administration/Profils';
import Employes    from './pages/crm/administration/Employes';
import Permissions from './pages/crm/administration/Permissions';
import Parametres  from './pages/crm/administration/Parametres';

export default function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <BrowserRouter>
          <Routes>
            {/* Accueil */}
            <Route path="/"        element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />

            {/* Auth */}
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/OtpPage"      element={<OtpPage />} />
            <Route path="/segmentation" element={<SegmentationPage />} />

            {/* Espace client */}
            <Route path="/client/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/client/reclamation"     element={<ProtectedRoute><ClientReclamation /></ProtectedRoute>} />
            <Route path="/client/suivi"           element={<ProtectedRoute><SuiviReclamation /></ProtectedRoute>} />
            <Route path="/client/historique"      element={<ProtectedRoute><Historique /></ProtectedRoute>} />
            <Route path="/client/promotions"      element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
            <Route path="/client/demande-service" element={<ProtectedRoute><DemandeService /></ProtectedRoute>} />
            <Route path="/client/mes-demandes"    element={<ProtectedRoute><MesDemandes /></ProtectedRoute>} />

            {/* CRM */}
            <Route path="/crm/dashboard"     element={<CRMDashboard />} />
            <Route path="/crm/clients"       element={<Clients />} />
            <Route path="/crm/clients/:id"   element={<ClientDetail />} />
            <Route path="/crm/factures"      element={<Factures />} />
            <Route path="/crm/reclamations"  element={<Reclamations />} />
            <Route path="/crm/interventions" element={<Interventions />} />
            <Route path="/crm/offres"        element={<Offres />} />
            <Route path="/crm/statistiques"  element={<Statistiques />} />
            <Route path="/crm/assignation"   element={<Assignation />} />

            {/* Demandes de service — 3 niveaux */}
            <Route path="/crm/demandes"                   element={<DemandesCategories />} />
            <Route path="/crm/demandes/:type_service"     element={<DemandesListe />} />
            <Route path="/crm/demandes/:type_service/:id" element={<DemandeDetail />} />

            {/* CRM Administration */}
            <Route path="/crm/administration/profils"     element={<Profils />} />
            <Route path="/crm/administration/employes"    element={<Employes />} />
            <Route path="/crm/administration/permissions" element={<Permissions />} />
            <Route path="/crm/administration/parametres"  element={<Parametres />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </BrowserRouter>
      </PermissionProvider>
    </AuthProvider>
  );
}