export type FilerStatus = 'filer' | 'non-filer';

export interface CalculationResult {
  usdAmount: number;
  interbankRate: number; // same rate used for both columns
  basePkr: number;       // same base for both (USD × interbankRate)

  // SadaPay
  sadapayFee: number;    // international transaction fee (6%)
  sadapayWht: number;    // withholding tax (5% filer / 10% non-filer)
  sadapayTotal: number;  // base + fee + wht

  // Traditional Bank
  bankMarkup: number;     // 3% markup on base
  networkFee: number;     // 1.5% Mastercard/Visa network fee
  bankFee: number;        // international transaction fee (6%)
  bankWht: number;        // withholding tax
  bankTotal: number;      // base + markup + network + fee + wht

  savings: number;        // bankTotal - sadapayTotal
}
