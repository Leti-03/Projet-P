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
import CRMProtectedRoute from './components/crm/ProtectedRoute.jsx';

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
import MonProfil   from './pages/crm/MonProfil.jsx';

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

                <Route path="/dashboard"     element={<CRMProtectedRoute><CRMDashboard /></CRMProtectedRoute>} />
                <Route path="/clients"       element={<CRMProtectedRoute><Clients /></CRMProtectedRoute>} />
                <Route path="/clients/:id"   element={<CRMProtectedRoute><ClientDetail /></CRMProtectedRoute>} />
                <Route path="/reclamations"  element={<CRMProtectedRoute><Reclamations /></CRMProtectedRoute>} />
                <Route path="/interventions" element={<CRMProtectedRoute><Interventions /></CRMProtectedRoute>} />
                <Route path="/offres"        element={<CRMProtectedRoute><Offres /></CRMProtectedRoute>} />
                <Route path="/statistiques"  element={<CRMProtectedRoute><Statistiques /></CRMProtectedRoute>} />
                <Route path="/assignation"   element={<CRMProtectedRoute><Assignation /></CRMProtectedRoute>} />
                <Route path="/factures"      element={<CRMProtectedRoute><Factures /></CRMProtectedRoute>} />

                <Route path="/demandes"                   element={<CRMProtectedRoute><DemandesCategories /></CRMProtectedRoute>} />
                <Route path="/demandes/:type_service"     element={<CRMProtectedRoute><DemandesListe /></CRMProtectedRoute>} />
                <Route path="/demandes/:type_service/:id" element={<CRMProtectedRoute><DemandeDetail /></CRMProtectedRoute>} />

                <Route path="/mon-profil"                 element={<CRMProtectedRoute><MonProfil /></CRMProtectedRoute>} />

                <Route path="/administration/profils"     element={<CRMProtectedRoute><Profils /></CRMProtectedRoute>} />
                <Route path="/administration/employes"    element={<CRMProtectedRoute><Employes /></CRMProtectedRoute>} />
                <Route path="/administration/permissions" element={<CRMProtectedRoute><Permissions /></CRMProtectedRoute>} />
                <Route path="/administration/parametres"  element={<CRMProtectedRoute><Parametres /></CRMProtectedRoute>} />
                <Route path="/administration/logs"        element={<CRMProtectedRoute><Logs /></CRMProtectedRoute>} />

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