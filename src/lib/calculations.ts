import {
  SADAPAY_FX_BONUS,
  BANK_MARKUP,
  INTNL_FEE_RATE,
  INTNL_FEE_FLAT,
  INTNL_FEE_THRESHOLD,
  WHT_FILER,
  WHT_NONFILER,
  SADAPAY_INTNL_FEE,
} from './constants';
import type { FilerStatus, CalculationResult } from './types';

function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatUSD(amount: number): string {
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

export function calculateBreakdown(
  usd: number,
  rate: number,
  filerStatus: FilerStatus
): CalculationResult {
  const sadapayRate = rate * (1 + SADAPAY_FX_BONUS);
  const bankRate = rate * (1 - BANK_MARKUP);

  const sadapayPkr = usd * sadapayRate;
  const bankPkr = usd * bankRate;

  // SadaPay: NO international transaction fee
  const sadapayFee = SADAPAY_INTNL_FEE;

  // Traditional Bank: 6% international transaction fee
  const bankFee = calculateIntnlFee(bankPkr);

  // Withholding tax on (amount + fee) for both
  const whtBase = sadapayPkr + sadapayFee;
  const bankWhtBase = bankPkr + bankFee;
  const wht = calculateWHT(whtBase, filerStatus);
  const bankWht = calculateWHT(bankWhtBase, filerStatus);

  // Totals
  const sadapayTotal = sadapayPkr + sadapayFee + wht;
  const bankTotal = bankPkr + bankFee + bankWht;

  // Savings
  const savings = bankTotal - sadapayTotal;

  return {
    usdAmount: usd,
    marketRate: rate,
    sadapayRate,
    bankRate,
    sadapayPkr,
    bankPkr,
    sadapayFee,
    bankFee,
    wht,
    bankWht,
    sadapayTotal,
    bankTotal,
    savings,
  };
}

export { formatPKR, formatUSD };
