'use client';

import type { FilerStatus } from '@/lib/types';

interface FilerToggleProps {
  value: FilerStatus;
  onChange: (value: FilerStatus) => void;
}

const options: { value: FilerStatus; label: string }[] = [
  { value: 'filer', label: 'Filer' },
  { value: 'non-filer', label: 'Non-Filer' },
];

export default function FilerToggle({ value, onChange }: FilerToggleProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-sadapay-navy mb-2 tracking-wide uppercase">
        Tax Status
      </label>
      <div className="flex border-2 border-sadapay-navy/10 overflow-hidden">
        {options.map((option) => (
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
    </div>
  );
}
