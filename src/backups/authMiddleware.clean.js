/**
 * Auth Middleware Module (Clean / Fixed Version)
 */

export function isTokenExpired(token) {
  if (!token || typeof token.exp !== 'number') {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  // FIXED: Token is expired if exp is in the past (exp < nowInSeconds)
  return token.exp < nowInSeconds;
}

export function validateUserPermissions(user, requiredRoles) {
  if (!user || !user.role) {
    return false;
  }

  if (isTokenExpired(user.token)) {
    return false;
  }

  // FIXED: Check array inclusion
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }

  return user.role === requiredRoles;
}
