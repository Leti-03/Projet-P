// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// ── Providers Client ──────────────────────────────────────────────────────────
import { AuthProvider }       from './context/AuthContext';
import { PermissionProvider } from './context/PermissionContext';
import ProtectedRoute         from './components/ProtectedRoute';

// ── Providers CRM ─────────────────────────────────────────────────────────────
import { AuthProvider as CRMAuthProvider }             from './context/crm/AuthContext.jsx';
import { PermissionProvider as CRMPermissionProvider } from './context/crm/PermissionContext';

// ── Pages auth client ─────────────────────────────────────────────────────────
import Welcome          from './pages/client/welcome.jsx';
import Login            from './pages/client/Login.jsx';
import Register         from './pages/client/Register.jsx';
import OtpPage          from './pages/client/OtpPage.jsx';
import SegmentationPage from './pages/client/SegmentationPage.jsx';

// ── Pages client ──────────────────────────────────────────────────────────────
import ClientDashboard   from './pages/client/Dashboard';
import ClientReclamation from './pages/client/Reclamation';
import SuiviReclamation  from './pages/client/SuiviReclamation';
import Historique        from './pages/client/Historique';
import Promotions        from './pages/client/offreclient.jsx';
import DemandeService    from './pages/client/demandeService.jsx';
import MesDemandes       from './pages/client/mesDemande.jsx';

// ── Pages CRM ─────────────────────────────────────────────────────────────────
import LoginCRM      from './pages/crm/login.jsx';
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
import Logs        from './pages/crm/administration/logs.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Accueil ───────────────────────────────────────────────────────── */}
        <Route path="/"        element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* ── Espace Client (AuthContext client) ────────────────────────────── */}
        <Route path="/*" element={
          <AuthProvider>
            <PermissionProvider>
              <Routes>
                <Route path="/login"        element={<Login />} />
                <Route path="/register"     element={<Register />} />
                <Route path="/OtpPage"      element={<OtpPage />} />
                <Route path="/segmentation" element={<SegmentationPage />} />

                <Route path="/client/dashboard"       element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
                <Route path="/client/reclamation"     element={<ProtectedRoute><ClientReclamation /></ProtectedRoute>} />
                <Route path="/client/suivi"           element={<ProtectedRoute><SuiviReclamation /></ProtectedRoute>} />
                <Route path="/client/historique"      element={<ProtectedRoute><Historique /></ProtectedRoute>} />
                <Route path="/client/promotions"      element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
                <Route path="/client/demande-service" element={<ProtectedRoute><DemandeService /></ProtectedRoute>} />
                <Route path="/client/mes-demandes"    element={<ProtectedRoute><MesDemandes /></ProtectedRoute>} />
              </Routes>
            </PermissionProvider>
          </AuthProvider>
        } />

        {/* ── Espace CRM (AuthContext CRM) ──────────────────────────────────── */}
        <Route path="/crm/*" element={
          <CRMAuthProvider>
            <CRMPermissionProvider>
              <Routes>
                <Route path="/login" element={<LoginCRM />} />

                <Route path="/dashboard"     element={<CRMDashboard />} />
                <Route path="/clients"       element={<Clients />} />
                <Route path="/clients/:id"   element={<ClientDetail />} />
                <Route path="/factures"      element={<Factures />} />
                <Route path="/reclamations"  element={<Reclamations />} />
                <Route path="/interventions" element={<Interventions />} />
                <Route path="/offres"        element={<Offres />} />
                <Route path="/statistiques"  element={<Statistiques />} />
                <Route path="/assignation"   element={<Assignation />} />

                <Route path="/demandes"                   element={<DemandesCategories />} />
                <Route path="/demandes/:type_service"     element={<DemandesListe />} />
                <Route path="/demandes/:type_service/:id" element={<DemandeDetail />} />

                <Route path="/administration/profils"     element={<Profils />} />
                <Route path="/administration/employes"    element={<Employes />} />
                <Route path="/administration/permissions" element={<Permissions />} />
                <Route path="/administration/parametres"  element={<Parametres />} />
                <Route path="/administration/logs"        element={<Logs />} />

                <Route path="*" element={<Navigate to="/crm/login" replace />} />
              </Routes>
            </CRMPermissionProvider>
          </CRMAuthProvider>
        } />

        {/* ── 404 global ────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />

      </Routes>
    </BrowserRouter>
  );
}