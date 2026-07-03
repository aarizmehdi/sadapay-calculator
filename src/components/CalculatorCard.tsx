'use client';

import { useState, useEffect, useCallback } from 'react';
import AmountInput from './AmountInput';
import FilerToggle from './FilerToggle';
import FXRateBanner from './FXRateBanner';
import FeeBreakdown from './FeeBreakdown';
import BankComparison from './BankComparison';
import { fetchExchangeRate, type ExchangeRateResult } from '@/lib/exchange-rate';
import { calculateBreakdown, formatPKR, formatUSD } from '@/lib/calculations';
import type { FilerStatus, CalculationResult } from '@/lib/types';

type CalculatorMode = 'usd-to-pkr' | 'pkr-to-usd';

const modeOptions: { value: CalculatorMode; label: string }[] = [
  { value: 'usd-to-pkr', label: 'USD → PKR' },
  { value: 'pkr-to-usd', label: 'PKR → USD' },
];

function ModeToggle({
  value,
  onChange,
}: {
  value: CalculatorMode;
  onChange: (value: CalculatorMode) => void;
}) {
  return (
    <div className="flex border-2 border-sadapay-navy/10 overflow-hidden">
      {modeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 h-11 text-sm font-semibold tracking-wide transition-colors ${
            value === option.value
              ? 'bg-sadapay-navy text-white'
              : 'bg-white text-sadapay-navy/60 hover:text-sadapay-navy hover:bg-gray-50'
          }`}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function CalculatorCard() {
  const [mode, setMode] = useState<CalculatorMode>('usd-to-pkr');
  const [inputAmount, setInputAmount] = useState(0);
  const [filerStatus, setFilerStatus] = useState<FilerStatus>('filer');
  const [rateResult, setRateResult] = useState<ExchangeRateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [manualRate, setManualRate] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch exchange rate on mount
  useEffect(() => {
    let mounted = true;

    fetchExchangeRate()
      .then((result) => {
        if (mounted) {
          setRateResult(result);
          setLoading(false);
          if (result.source === 'fallback') {
            setError(true);
          }
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
          setError(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const effectiveRate = manualRate
    ? parseFloat(manualRate)
    : rateResult?.rate ?? 0;

  // Derive USD amount based on mode
  const usdAmount =
    mode === 'usd-to-pkr'
      ? inputAmount
      : effectiveRate > 0
        ? inputAmount / effectiveRate
        : 0;

  const result: CalculationResult | null =
    usdAmount > 0 && effectiveRate > 0
      ? calculateBreakdown(usdAmount, effectiveRate, filerStatus)
      : null;

  // Bank markup = difference between market rate and bank rate
  const bankMarkup = usdAmount > 0 && effectiveRate > 0
    ? usdAmount * effectiveRate * 0.03
    : 0;

  const handleCopy = useCallback(() => {
    if (!result) return;

    const text = [
      `SadaPay Banking Calculator`,
      `---`,
      `USD Amount: $${result.usdAmount}`,
      `Exchange Rate: 1 USD = ${result.marketRate.toFixed(2)} PKR`,
      `---`,
      `SadaPay Total: ${formatPKR(result.sadapayTotal)}`,
      `Bank Total: ${formatPKR(result.bankTotal)}`,
      `Savings: ${formatPKR(result.savings)}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const isReverseMode = mode === 'pkr-to-usd';

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-sadapay-navy tracking-tight">
          Banking Calculator
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Compare USD → PKR conversion fees
        </p>
      </div>

      {/* FX Rate Banner */}
      <div className="mb-4">
        <FXRateBanner
          rateResult={rateResult}
          loading={loading}
          error={error}
          manualRate={manualRate}
          onManualRateChange={setManualRate}
        />
      </div>

      {/* Input Section */}
      <div className="bg-white border border-gray-200 p-6 mb-4">
        <div className="space-y-4">
          {/* Mode Toggle */}
          <ModeToggle value={mode} onChange={setMode} />

          <AmountInput
            value={inputAmount}
            onChange={setInputAmount}
            label={isReverseMode ? 'PKR Amount' : 'USD Amount'}
            currencyPrefix={isReverseMode ? 'Rs.' : '$'}
          />
          <FilerToggle value={filerStatus} onChange={setFilerStatus} />
        </div>

        {/* Reverse mode hint */}
        {result && isReverseMode && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            USD Equivalent:{' '}
            <span className="font-semibold text-sadapay-navy">
              {formatUSD(usdAmount)}
            </span>{' '}
            at market rate
          </p>
        )}
      </div>

      {/* Results: Side-by-side columns */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* SadaPay Column */}
          <div className="bg-white border border-gray-200 p-6">
            <FeeBreakdown
              pkrAmount={result.sadapayPkr}
              fee={result.sadapayFee}
              wht={result.wht}
              total={result.sadapayTotal}
              filerStatus={filerStatus}
              usdAmount={usdAmount}
            />
          </div>

          {/* Bank Comparison Column */}
          <div className="bg-white border border-gray-200 p-6">
            <BankComparison
              pkrAmount={result.bankPkr}
              fee={result.bankFee}
              wht={result.bankWht}
              total={result.bankTotal}
              sadapayTotal={result.sadapayTotal}
              savings={result.savings}
              filerStatus={filerStatus}
              usdAmount={usdAmount}
              bankMarkup={bankMarkup}
            />
          </div>
        </div>
      )}

      {/* Copy Button */}
      {result && (
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={handleCopy}
            className="h-11 px-6 text-sm font-semibold text-sadapay-navy bg-white border-2 border-sadapay-navy/20 hover:border-sadapay-navy transition-colors tracking-wide"
          >
            {copied ? '✓ Copied!' : 'Copy Results'}
          </button>
        </div>
      )}

      {/* Footer / Disclaimer */}
      <div className="text-center px-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          Rates are indicative only. Actual exchange rates may vary.
          SadaPay&apos;s rate is 10% better than the interbank rate.
          Traditional banks charge ~3% markup on the interbank rate.
        </p>
      </div>
    </div>
  );
}
