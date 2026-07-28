/**
 * Payment Gateway Module (Buggy Backup)
 */

export function calculateDiscountedTotal(amount, tier) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Invalid purchase amount');
  }

  let discountRate = 0;

  if (tier === 'PLATINUM') {
    discountRate = amount >= 2000 ? 0.25 : 0.20;
  } else if (tier === 'GOLD') {
    discountRate = amount >= 1000 ? 0.15 : 0;
  } else if (tier === 'SILVER') {
    discountRate = amount >= 500 ? 0.05 : 0;
  }

  return Number((amount - amount * discountRate).toFixed(2));
}

export function getTierTransactionFee(amount, tierLevel) {
  const feeRates = [0.05, 0.03, 0.02, 0.01];
  const rate = feeRates[tierLevel] ?? feeRates[feeRates.length - 1];

  return Number((amount * rate).toFixed(2));
}
