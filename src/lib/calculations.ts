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

function calculateWHT(amount: number, filerStatus: FilerStatus): number {
  const rate = filerStatus === 'filer' ? WHT_FILER : WHT_NONFILER;
  return amount * rate;
}

function calculateIntnlFee(pkrAmount: number): number {
  if (pkrAmount <= INTNL_FEE_THRESHOLD) {
    return INTNL_FEE_FLAT + pkrAmount * INTNL_FEE_RATE;
  }
  return pkrAmount * INTNL_FEE_RATE;
}

/**
 * Calculate fee breakdown for both SadaPay and Traditional Bank.
 *
 * Both use the SAME interbank market rate for the base amount.
 * Divergence comes from fees and markups applied below.
 *
 * SadaPay:
 *   Base = USD × interbankRate
 *   International Fee = 6% of Base (per SadaPay SOC)
 *   WHT = 5%/10% of (Base + International Fee)
 *   Total = Base + International Fee + WHT
 *
 * Traditional Bank:
 *   Base = USD × interbankRate
 *   Bank Markup = 3% of Base
 *   Network Fee = 1.5% of Base (Mastercard/Visa)
 *   International Fee = 6% of Base
 *   WHT = 5%/10% of (Base + Bank Markup + Network Fee + International Fee)
 *   Total = Base + Bank Markup + Network Fee + International Fee + WHT
 */
export function calculateBreakdown(
  usd: number,
  rate: number,
  filerStatus: FilerStatus
): CalculationResult {
  // Both use same interbank rate
  const basePkr = usd * rate;

  // --- SadaPay ---
  const sadapayFee = calculateIntnlFee(basePkr);
  const sadapayWhtBase = basePkr + sadapayFee;
  const sadapayWht = calculateWHT(sadapayWhtBase, filerStatus);
  const sadapayTotal = sadapayWhtBase + sadapayWht;

  // --- Traditional Bank ---
  const bankMarkup = basePkr * BANK_MARKUP_RATE;
  const networkFee = basePkr * NETWORK_FEE_RATE;
  const bankFee = calculateIntnlFee(basePkr);
  const bankWhtBase = basePkr + bankMarkup + networkFee + bankFee;
  const bankWht = calculateWHT(bankWhtBase, filerStatus);
  const bankTotal = bankWhtBase + bankWht;

  const savings = bankTotal - sadapayTotal;

  return {
    usdAmount: usd,
    interbankRate: rate,
    basePkr,
    sadapayFee,
    sadapayWht,
    sadapayTotal,
    bankMarkup,
    networkFee,
    bankFee,
    bankWht,
    bankTotal,
    savings,
  };
}
