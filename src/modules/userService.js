/**
 * User Service Module (Buggy Version Backup)
 */

export function getUserDisplayInfo(user) {
  // BUG: Direct property access on potentially undefined nested objects
  const name = user.profile.name.toUpperCase();
  const email = user.email.toLowerCase();
  const themeMode = user.settings.theme.mode;

  return {
    displayName: `${name} (${email})`,
    theme: themeMode,
    isVip: user.vipStatus || false
  };
}

export function formatUserAddress(user) {
  // BUG: Accessing user.address without checking if address exists
  const street = user.address.street;
  const city = user.address.city.toUpperCase();
  const zip = user.address.zipCode;

  return `${street}, ${city} ${zip}`;
}

export function calculateAccountAgeYears(user) {
  if (!user) return 0;
  // BUG: user.createdAt might be missing or invalid string, crashes on new Date() or .getFullYear()
  const createdYear = new Date(user.createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - createdYear;
}
