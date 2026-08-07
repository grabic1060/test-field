/**
 * User Service Module
 */

export function getUserDisplayInfo(user = {}) {
  const name = typeof user.profile?.name === 'string' ? user.profile.name.toUpperCase() : 'UNKNOWN';
  const email = typeof user.email === 'string' ? user.email.toLowerCase() : 'unknown@example.com';
  const themeMode = typeof user.settings?.theme?.mode === 'string' ? user.settings.theme.mode : 'default';

  return {
    displayName: `${name} (${email})`,
    theme: themeMode,
    isVip: Boolean(user.vipStatus)
  };
}

export function formatUserAddress(user = {}) {
  const street = user.address?.street || 'UNKNOWN STREET';
  const city = typeof user.address?.city === 'string' ? user.address.city.toUpperCase() : 'UNKNOWN CITY';
  const zip = user.address?.zipCode || '00000';

  return `${street}, ${city} ${zip}`;
}

export function calculateAccountAgeYears(user = {}) {
  const createdAt = user.createdAt;
  const createdDate = createdAt ? new Date(createdAt) : null;

  if (!createdDate || Number.isNaN(createdDate.getTime())) {
    return 0;
  }

  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - createdDate.getFullYear());
}
