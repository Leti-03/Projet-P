import { usePermission as usePermissionContext } from '../context/PermissionContext';

/**
 * Hook personnalisé pour vérifier les permissions facilement
 * Exemple : const { hasPermission } = usePermission();
 */
const usePermission = () => {
  const { hasPermission, permissions } = usePermissionContext();
  
  return {
    hasPermission,
    allPermissions: permissions
  };
};

export default usePermission;