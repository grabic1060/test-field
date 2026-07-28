/**
 * User Service Module (Buggy Version Backup)
 */

export function getUserDisplayInfo(user = {}) {
  const name = user.profile?.name?.toUpperCase() ?? 'UNKNOWN';
  const email = user.email?.toLowerCase() ?? 'unknown@example.com';
  const themeMode = user.settings?.theme?.mode ?? 'light';

  return {
    displayName: `${name} (${email})`,
    theme: themeMode,
    isVip: Boolean(user.vipStatus)
  };
}

export function formatUserAddress(user = {}) {
  const street = user.address?.street ?? '';
  const city = user.address?.city?.toUpperCase() ?? '';
  const zip = user.address?.zipCode ?? '';

  return [street, city, zip].filter(Boolean).join(' ');
}

export function calculateAccountAgeYears(user = {}) {
  const createdAt = new Date(user.createdAt);
  if (Number.isNaN(createdAt.getTime())) return 0;

  const currentYear = new Date().getFullYear();
  return currentYear - createdAt.getFullYear();
}
