import {
  INTNL_FEE_RATE,
  INTNL_FEE_FLAT,
  INTNL_FEE_THRESHOLD,
  BANK_MARKUP_RATE,
  NETWORK_FEE_RATE,
  WHT_FILER,
  WHT_NONFILER,
} from './constants';
import type { FilerStatus, CalculationResult } from './types';

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** WHT rate based on filer status */
function whtRate(filerStatus: FilerStatus): number {
  return filerStatus === 'filer' ? WHT_FILER : WHT_NONFILER;
}

/** International transaction fee (6%, or Rs.55 + 6% for amounts under Rs.800) */
function intnlFee(pkrAmount: number): number {
  if (pkrAmount <= INTNL_FEE_THRESHOLD) {
    return INTNL_FEE_FLAT + pkrAmount * INTNL_FEE_RATE;
  }
  return pkrAmount * INTNL_FEE_RATE;
}

/**
 * Unified calculation — both sides start from identical base_pkr.
 *
 * SadaPay:
 *   basePkr        = USD × interbankRate
 *   intnlFee       = 6% of basePkr
 *   wht            = (basePkr + intnlFee) × taxRate
 *   total          = basePkr + intnlFee + wht
 *
 * Traditional Bank:
 *   basePkr        = USD × interbankRate  (same)
 *   bankMarkup     = 3.5% of basePkr
 *   networkFee     = 1.5% of basePkr
 *   wht            = (basePkr + bankMarkup + networkFee) × taxRate
 *   total          = basePkr + bankMarkup + networkFee + wht
 *
 * Savings = bankTotal - sadapayTotal
 */
export function calculateBreakdown(
  usd: number,
  rate: number,
  filerStatus: FilerStatus
): CalculationResult {
  const rateFn = whtRate(filerStatus);
  const basePkr = usd * rate;

  // --- SadaPay ---
  const sadapayFee = intnlFee(basePkr);
  const sadapayGross = basePkr + sadapayFee;
  const sadapayWht = sadapayGross * rateFn;
  const sadapayTotal = sadapayGross + sadapayWht;

  // --- Traditional Bank ---
  const bankMarkup = basePkr * BANK_MARKUP_RATE;
  const networkFee = basePkr * NETWORK_FEE_RATE;
  const bankGross = basePkr + bankMarkup + networkFee;
  const bankWht = bankGross * rateFn;
  const bankTotal = bankGross + bankWht;

  return {
    usdAmount: usd,
    interbankRate: rate,
    basePkr,
    sadapayFee,
    sadapayWht,
    sadapayTotal,
    bankMarkup,
    networkFee,
    bankWht,
    bankTotal,
    savings: bankTotal - sadapayTotal,
  };
}
