'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { formatPKR } from '@/lib/calculations';

interface BankComparisonProps {
  savings: number;
  usdAmount: number;
}

export default function BankComparison({
  savings,
  usdAmount,
}: BankComparisonProps) {
  const isEmpty = usdAmount === 0;
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (badgeRef.current && savings > 0) {
      gsap.fromTo(
        badgeRef.current,
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
        <div className="space-y-4">
          {/* Notice — no made-up PKR figures */}
          <div className="p-3 bg-red-50 border border-red-200 text-center">
            <p className="text-xs font-semibold text-red-700 tracking-wide uppercase mb-1">
              Per SadaPay
            </p>
            <p className="text-xs text-red-600 leading-relaxed">
              Traditional banks push cross-border transaction costs up to 10%.*
            </p>
            <p className="text-[10px] text-red-400 mt-1">
              * SadaPay&apos;s published statement
            </p>
          </div>

          {/* Savings badge — real, based on SadaPay's 6% vs bank 10% */}
          {savings > 0 && (
            <div
              ref={badgeRef}
              className="p-4 bg-green-50 border border-green-200 text-center"
            >
              <p className="text-xs font-semibold text-green-700 tracking-wide uppercase">
                You Save
              </p>
              <p className="text-2xl font-bold text-green-700 font-mono mt-1">
                {formatPKR(savings)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                by using SadaPay instead of a traditional bank
              </p>
            </div>
          )}

          {/* Footnote */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            SadaPay charges 6% (+ Rs.55 under Rs.800). Banks charge various fees
            (markup, network, processing) that SadaPay states total up to 10%.
          </p>
        </div>
      )}
    </div>
  );
}
