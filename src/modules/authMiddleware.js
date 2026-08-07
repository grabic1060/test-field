/**
 * Auth Middleware Module (Buggy Backup)
 */

export function isTokenExpired(token) {
  if (!token || typeof token.exp !== 'number') {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  return token.exp < nowInSeconds;
}

export function validateUserPermissions(user, requiredRoles) {
  if (!user || !user.role) {
    return false;
  }

  if (isTokenExpired(user.token)) {
    return false;
  }

  return Array.isArray(requiredRoles)
    ? requiredRoles.includes(user.role)
    : user.role === requiredRoles;
}
