export type FilerStatus = 'filer' | 'non-filer';

export interface CalculationResult {
  usdAmount: number;
  interbankRate: number;
  basePkr: number; // same for both — USD × interbankRate

  // SadaPay
  sadapayFee: number;    // international transaction fee (6% of base)
  sadapayWht: number;    // WHT on (base + fee) at 5% or 10%
  sadapayTotal: number;  // base + fee + wht

  // Traditional Bank
  bankMarkup: number;     // 3.5% of base
  networkFee: number;     // 1.5% of base
  bankWht: number;        // WHT on (base + markup + network) at 5% or 10%
  bankTotal: number;      // base + markup + network + wht

  savings: number;        // bankTotal - sadapayTotal
}
