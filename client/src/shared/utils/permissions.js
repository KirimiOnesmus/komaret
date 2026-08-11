import { ROLES } from '../constants/roles';



export function hasAnyRole(user, roles = []) {
  if (!user || !Array.isArray(user.roles)) return false;
  return roles.some((role) => user.roles.includes(role));
}

export function isAdmin(user) {
  return hasAnyRole(user, [ROLES.ADMIN]);
}

export function isManagerOrAdmin(user) {
  return hasAnyRole(user, [ROLES.ADMIN, ROLES.MANAGER]);
}

export function ownsResource(user, resource) {
  return Boolean(user?.id && resource?.ownerId && user.id === resource.ownerId);
}

export function canEditResource(user, resource) {
  return isManagerOrAdmin(user) || ownsResource(user, resource);
}
