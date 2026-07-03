export type FilerStatus = 'filer' | 'non-filer';

export interface CalculationResult {
  usdAmount: number;
  marketRate: number;
  sadapayRate: number;
  bankRate: number;
  sadapayPkr: number;
  bankPkr: number;
  sadapayFee: number;
  bankFee: number;
  wht: number;
  bankWht: number;
  sadapayTotal: number;
  bankTotal: number;
  savings: number;
}
