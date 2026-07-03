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
      // Subtle pulse on the savings amount
      gsap.to(badgeRef.current.querySelector('.savings-amount'), {
        textShadow: '0 0 12px rgba(34,197,94,0.3)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, [savings]);

  return (
    <div className="w-full">
      <div className="h-0.5 bg-red-800/30 w-full mb-4" />
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
              <p className="text-2xl font-bold text-green-700 font-mono mt-1 savings-amount">
                {formatPKR(savings)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                by using SadaPay instead of a traditional bank
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
