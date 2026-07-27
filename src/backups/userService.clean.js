/**
 * User Service Module (Clean / Fixed Version)
 */

export function getUserDisplayInfo(user) {
  if (!user) {
    return {
      displayName: 'Guest User',
      theme: 'light',
      isVip: false
    };
  }

  const name = user.profile?.name ? user.profile.name.toUpperCase() : 'ANONYMOUS';
  const email = user.email ? user.email.toLowerCase() : 'no-email';
  const themeMode = user.settings?.theme?.mode || 'light';

  return {
    displayName: `${name} (${email})`,
    theme: themeMode,
    isVip: Boolean(user.vipStatus)
  };
}

export function formatUserAddress(user) {
  if (!user?.address) {
    return 'No address provided';
  }

  const street = user.address.street || 'Unknown Street';
  const city = user.address.city ? user.address.city.toUpperCase() : 'UNKNOWN CITY';
  const zip = user.address.zipCode || '';

  return `${street}, ${city} ${zip}`.trim();
}

export function calculateAccountAgeYears(user) {
  if (!user?.createdAt) return 0;
  const createdDate = new Date(user.createdAt);
  if (isNaN(createdDate.getTime())) return 0;

  const createdYear = createdDate.getFullYear();
  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - createdYear);
}
