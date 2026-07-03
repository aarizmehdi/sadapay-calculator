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
  { value: 'usd-to-pkr', label: 'USD \u2192 PKR' },
  { value: 'pkr-to-usd', label: 'PKR \u2192 USD' },
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
          } else {
            setError(false);
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

  const handleCopy = useCallback(() => {
    if (!result) return;

    const text = [
      `SadaPay Banking Calculator`,
      `---`,
      `USD Amount: $${result.usdAmount}`,
      `Exchange Rate: 1 USD = ${result.interbankRate.toFixed(2)} PKR`,
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
          Compare USD \u2192 PKR conversion fees
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
          <ModeToggle value={mode} onChange={setMode} />

          <AmountInput
            value={inputAmount}
            onChange={setInputAmount}
            label={isReverseMode ? 'PKR Amount' : 'USD Amount'}
            currencyPrefix={isReverseMode ? 'Rs.' : '$'}
          />
          <FilerToggle value={filerStatus} onChange={setFilerStatus} />
        </div>

        {/* Live conversion display */}
        {result && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-gray-500">
                {isReverseMode ? 'PKR' : 'USD'}
              </span>
              <span className="text-lg font-bold text-sadapay-navy">
                {isReverseMode ? formatPKR(inputAmount) : formatUSD(usdAmount)}
              </span>
              <span className="text-gray-300">{'\u2192'}</span>
              <span className="text-gray-500">
                {isReverseMode ? 'USD' : 'PKR'}
              </span>
              <span className="text-lg font-bold text-sadapay-navy">
                {isReverseMode ? formatUSD(usdAmount) : formatPKR(result.basePkr)}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">
              1 USD = {effectiveRate.toFixed(2)} PKR (interbank rate)
            </p>
          </div>
        )}
      </div>

      {/* Results: Side-by-side columns */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* SadaPay Column */}
          <div className="bg-white border border-gray-200 p-6">
            <FeeBreakdown
              pkrAmount={result.basePkr}
              fee={result.sadapayFee}
              wht={result.sadapayWht}
              total={result.sadapayTotal}
              filerStatus={filerStatus}
              usdAmount={usdAmount}
            />
          </div>

          {/* Bank Comparison Column */}
          <div className="bg-white border border-gray-200 p-6">
            <BankComparison
              savings={result.savings}
              usdAmount={usdAmount}
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
            {copied ? '\u2713 Copied!' : 'Copy Results'}
          </button>
        </div>
      )}

      {/* Footer / Disclaimer */}
      <div className="text-center px-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          WHT on gross total per FBR rules. Rates indicative only.
        </p>
      </div>
    </div>
  );
}
