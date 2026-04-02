/**
 * Dictionnaire de toutes les permissions disponibles dans le CRM.
 * Format : 'ressource:action'
 */
export const PERMISSIONS = {
  // GESTION DES CLIENTS
  CLIENTS_READ: 'clients:read',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',

  // GESTION DES FACTURES
  FACTURES_READ: 'factures:read',
  FACTURES_CREATE: 'factures:create',
  FACTURES_UPDATE: 'factures:update',
  FACTURES_DELETE: 'factures:delete',
  FACTURES_EXPORT: 'factures:export',

  // RÉCLAMATIONS (Tickets Desk)
  RECLAMATIONS_READ: 'reclamations:read',
  RECLAMATIONS_CREATE: 'reclamations:create',
  RECLAMATIONS_UPDATE: 'reclamations:update',
  RECLAMATIONS_DELETE: 'reclamations:delete',

  // INTERVENTIONS TECHNIQUES
  INTERVENTIONS_READ: 'interventions:read',
  INTERVENTIONS_CREATE: 'interventions:create',
  INTERVENTIONS_UPDATE: 'interventions:update',
  INTERVENTIONS_DELETE: 'interventions:delete',

  // OFFRES ET DEVIS
  OFFRES_READ: 'offres:read',
  OFFRES_CREATE: 'offres:create',
  OFFRES_UPDATE: 'offres:update',
  OFFRES_DELETE: 'offres:delete',

  // STATISTIQUES ET RAPPORTS
  STATS_VIEW: 'stats:view',
  STATS_FINANCIAL: 'stats:financial',

  // ADMINISTRATION (Réservé Admin)
  ADMIN_PROFILS: 'admin:profils',     // Gérer les rôles (RBAC)
  ADMIN_EMPLOYES: 'admin:employes',   // Gérer les comptes employés
  ADMIN_SETTINGS: 'admin:settings',   // Paramètres système
};

export default PERMISSIONS;