/**
 * Payment Gateway Module (Buggy Backup)
 */

export function calculateDiscountedTotal(amount, tier) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Invalid purchase amount');
  }

  let discountRate = 0;

  if (tier === 'PLATINUM') {
    if (amount >= 2000) discountRate = 0.25;
    else discountRate = 0.20;
  } else if (tier === 'GOLD') {
    if (amount >= 1000) {
      discountRate = 0.15;
    }
  } else if (tier === 'SILVER') {
    if (amount >= 500) discountRate = 0.05;
  }

  const discountAmount = amount * discountRate;
  return Number((amount - discountAmount).toFixed(2));
}

export function getTierTransactionFee(amount, tierLevel) {
  const feeRates = [0.05, 0.03, 0.02, 0.01];

  const safeIndex = Number.isInteger(tierLevel)
    ? Math.min(Math.max(tierLevel, 0), feeRates.length - 1)
    : feeRates.length - 1;
  const rate = feeRates[safeIndex] ?? feeRates[feeRates.length - 1];

  return Number((amount * rate).toFixed(2));
}
