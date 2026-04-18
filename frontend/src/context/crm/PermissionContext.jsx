// src/context/crm/PermissionContext.jsx
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { user, hasPermission: hasAuthPermission } = useAuth();

  const hasPermission = (ressource, action) => {
    if (!user) return false;
    if (user.est_superadmin === true) return true;
    return hasAuthPermission ? hasAuthPermission(ressource, action) : false;
  };

  return (
    <PermissionContext.Provider value={{ hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission doit être utilisé à l'intérieur de PermissionProvider");
  }
  return context;
};