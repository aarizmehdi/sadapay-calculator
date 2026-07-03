'use client';

import { useState } from 'react';
import type { ExchangeRateResult } from '@/lib/exchange-rate';

interface FXRateBannerProps {
  rateResult: ExchangeRateResult | null;
  loading: boolean;
  error: boolean;
  manualRate: string;
  onManualRateChange: (rate: string) => void;
}

export default function FXRateBanner({
  rateResult,
  loading,
  error,
  manualRate,
  onManualRateChange,
}: FXRateBannerProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return (
      <div className="w-full p-4 bg-white border border-gray-200">
        <div className="animate-pulse flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const displayRate = manualRate
    ? parseFloat(manualRate)
    : rateResult?.rate ?? 0;
  const source = rateResult?.source;
  const isFallback = source === 'fallback';
  const isCached = source === 'cache';

  return (
    <div className="w-full p-4 bg-white border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-sadapay-navy/50 tracking-wide uppercase">
            USD / PKR Exchange Rate
          </p>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-sadapay-navy/50">1 USD =</span>
              <input
                type="text"
                inputMode="decimal"
                value={manualRate}
                onChange={(e) => onManualRateChange(e.target.value)}
                className="w-24 h-8 px-2 text-sm font-bold text-sadapay-navy bg-white border border-sadapay-navy/20 focus:border-sadapay-navy focus:outline-none"
                autoFocus
                onBlur={() => {
                  if (!manualRate) setIsEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false);
                }}
              />
              <span className="text-sm font-bold text-sadapay-navy">PKR</span>
            </div>
          ) : (
            <p className="text-lg font-bold text-sadapay-navy mt-0.5">
              1 USD = {displayRate.toFixed(2)} PKR
            </p>
          )}
          {rateResult?.timestamp && !isEditing && (
            <p className="text-xs text-gray-400 mt-0.5">
              Last updated: {rateResult.timestamp.toLocaleTimeString()}
              {isFallback && (
                <span className="text-amber-600 ml-2">(fallback rate)</span>
              )}
              {isCached && (
                <span className="text-green-600 ml-2">(cached)</span>
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing && !manualRate && rateResult) {
              onManualRateChange(rateResult.rate.toString());
            }
          }}
          className="h-9 w-9 flex items-center justify-center text-sadapay-navy/40 hover:text-sadapay-navy transition-colors border border-transparent hover:border-gray-200"
          title="Set manual rate"
          aria-label="Set manual exchange rate"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">
          Could not fetch live rate. Enter the rate manually above.
        </p>
      )}
    </div>
  );
}
