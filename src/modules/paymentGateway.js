/**
 * Payment Gateway Module
 */

export function calculateDiscountedTotal(amount, tier) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Invalid purchase amount');
  }

  let discountRate = 0;

  if (tier === 'PLATINUM') {
    discountRate = amount >= 2000 ? 0.25 : 0.20;
  } else if (tier === 'GOLD') {
    if (amount >= 1000) {
      discountRate = 0.15;
    }
  } else if (tier === 'SILVER') {
    if (amount >= 500) {
      discountRate = 0.05;
    }
  }

  const discountAmount = amount * discountRate;
  return Number((amount - discountAmount).toFixed(2));
}

export function getTierTransactionFee(amount, tierLevel) {
  const feeRates = [0.05, 0.03, 0.02, 0.01, 0.005];
  const safeTierLevel = Number.isInteger(tierLevel) ? Math.max(0, Math.min(tierLevel, feeRates.length - 1)) : 0;
  const rate = feeRates[safeTierLevel] ?? feeRates[0];

  return amount * rate;
}
