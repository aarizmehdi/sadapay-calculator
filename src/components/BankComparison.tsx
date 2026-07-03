'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { formatPKR } from '@/lib/calculations';
import type { FilerStatus } from '@/lib/types';

interface BankComparisonProps {
  pkrAmount: number;
  bankMarkup: number;
  networkFee: number;
  wht: number;
  total: number;
  savings: number;
  filerStatus: FilerStatus;
  usdAmount: number;
}

function Row({
  label,
  value,
  subtext,
  isTotal = false,
}: {
  label: string;
  value: string;
  subtext?: string;
  isTotal?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, []);

  return (
    <div
      ref={rowRef}
      className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 ${
        isTotal ? 'border-t-2 border-red-800/30 mt-2 pt-4' : ''
      }`}
    >
      <div>
        <span
          className={`${
            isTotal ? 'text-base font-bold' : 'text-sm'
          } text-red-800`}
        >
          {label}
        </span>
        {subtext && (
          <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>
        )}
      </div>
      <span
        className={`font-mono ${
          isTotal
            ? 'text-xl font-bold text-red-800'
            : 'text-sm font-semibold text-red-800/70'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function BankComparison({
  pkrAmount,
  bankMarkup,
  networkFee,
  wht,
  total,
  savings,
  filerStatus,
  usdAmount,
}: BankComparisonProps) {
  const isEmpty = usdAmount === 0;
  const savingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (savingsRef.current && savings > 0) {
      gsap.fromTo(
        savingsRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3 }
      );
    }
  }, [savings]);

  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold text-red-800/50 tracking-wide uppercase mb-3">
        Traditional Bank Comparison
      </h3>

      {isEmpty ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400">
            Enter an amount to compare
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          <Row
            label="Base Amount"
            value={formatPKR(pkrAmount)}
            subtext="at interbank rate (same as SadaPay)"
          />
          <Row
            label="Bank Markup"
            value={formatPKR(bankMarkup)}
            subtext="7% — banks push costs up to 10% per SadaPay"
          />
          <Row
            label="Network Fee"
            value={formatPKR(networkFee)}
            subtext="3% Mastercard/Visa network fee"
          />
          <Row
            label="Withholding Tax"
            value={formatPKR(wht)}
            subtext={`${filerStatus === 'filer' ? '5%' : '10%'} on gross (base + markup + network) — per FBR`}
          />
          <Row label="Total Payable" value={formatPKR(total)} isTotal />

          {/* Savings badge */}
          {savings > 0 && (
            <div
              ref={savingsRef}
              className="mt-4 p-3 bg-green-50 border border-green-200 text-center"
            >
              <p className="text-xs font-semibold text-green-700 tracking-wide uppercase">
                You Save
              </p>
              <p className="text-lg font-bold text-green-700 font-mono">
                {formatPKR(savings)}
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                with SadaPay vs traditional banks
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
