/**
 * Auth Middleware Module
 */

export function isTokenExpired(token) {
  if (!token || typeof token.exp !== 'number') {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return token.exp < nowInSeconds;
}

export function validateUserPermissions(user, requiredRoles = []) {
  if (!user || typeof user.role !== 'string') {
    return false;
  }

  if (isTokenExpired(user.token)) {
    return false;
  }

  if (!Array.isArray(requiredRoles)) {
    return false;
  }

  return requiredRoles.includes(user.role);
}
