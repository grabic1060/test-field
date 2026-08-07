/**
 * User Service Module
 */

export function getUserDisplayInfo(user) {
  const profileName = user?.profile?.name;
  const email = user?.email;
  const themeMode = user?.settings?.theme?.mode;

  const name = typeof profileName === 'string' && profileName.trim()
    ? profileName.toUpperCase()
    : 'UNKNOWN';
  const normalizedEmail = typeof email === 'string' && email.trim()
    ? email.toLowerCase()
    : 'unknown@example.com';

  return {
    displayName: `${name} (${normalizedEmail})`,
    theme: themeMode ?? 'default',
    isVip: Boolean(user?.vipStatus)
  };
}

export function formatUserAddress(user) {
  const street = user?.address?.street ?? 'Unknown Street';
  const city = typeof user?.address?.city === 'string' && user.address.city.trim()
    ? user.address.city.toUpperCase()
    : 'UNKNOWN CITY';
  const zip = user?.address?.zipCode ?? 'N/A';

  return `${street}, ${city} ${zip}`;
}

export function calculateAccountAgeYears(user) {
  if (!user?.createdAt) return 0;

  const createdDate = new Date(user.createdAt);
  if (Number.isNaN(createdDate.getTime())) return 0;

  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - createdDate.getFullYear());
}
