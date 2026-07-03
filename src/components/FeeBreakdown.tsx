'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { formatPKR } from '@/lib/calculations';
import type { FilerStatus } from '@/lib/types';

interface FeeBreakdownProps {
  pkrAmount: number;
  fee: number;
  wht: number;
  total: number;
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
        isTotal ? 'border-t-2 border-sadapay-navy mt-2 pt-4' : ''
      }`}
    >
      <div>
        <span
          className={`${
            isTotal ? 'text-base font-bold' : 'text-sm'
          } text-sadapay-navy`}
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
            ? 'text-xl font-bold text-sadapay-navy'
            : 'text-sm font-semibold text-sadapay-navy/80'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function FeeBreakdown({
  pkrAmount,
  fee,
  wht,
  total,
  filerStatus,
  usdAmount,
}: FeeBreakdownProps) {
  const isEmpty = usdAmount === 0;

  return (
    <div className="w-full">
      <div className="h-0.5 bg-sadapay-navy w-full mb-4" />
      <h3 className="text-xs font-semibold text-sadapay-navy/50 tracking-wide uppercase mb-3">
        SadaPay Fee Breakdown
      </h3>

      {isEmpty ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400">
            Enter an amount to see the breakdown
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          <Row
            label="Base Amount"
            value={formatPKR(pkrAmount)}
            subtext="at Mastercard Interbank Rate"
          />
          <Row
            label="International Fee"
            value={formatPKR(fee)}
            subtext={`${fee === 0 ? 'Free' : '6% — per SadaPay Schedule of Charges'}`}
          />
          <Row
            label="Withholding Tax"
            value={formatPKR(wht)}
            subtext={`${filerStatus === 'filer' ? '5%' : '10%'} on gross (base + fee) — per FBR`}
          />
          <Row label="Total Payable" value={formatPKR(total)} isTotal />
        </div>
      )}
    </div>
  );
}
