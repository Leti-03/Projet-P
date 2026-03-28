import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth'; 
import { DEFAULT_ROLES } from '../utils/roles'; // Correction de la ligne 2 ici

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth(); // Récupère l'utilisateur connecté
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (user && user.role) {
      // On utilise nos DEFAULT_ROLES définis dans utils/roles.js
      const userPermissions = user.permissions || DEFAULT_ROLES[user.role] || [];
      setPermissions(userPermissions);
    } else {
      setPermissions([]);
    }
  }, [user]);

  // LA FONCTION MAGIQUE : hasPermission('clients:read')
  const hasPermission = (permission) => {
    // L'Admin a toujours raison (accès total)
    if (user?.role === 'ADMIN') return true;
    return permissions.includes(permission);
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission doit être utilisé au sein de PermissionProvider');
  }
  return context;
};