'use client';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  currencyPrefix?: string;
}

export default function AmountInput({
  value,
  onChange,
  label = 'USD Amount',
  currencyPrefix = '$',
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw);
    if (raw === '' || raw === '.') {
      onChange(0);
    } else if (!isNaN(num) && num >= 0) {
      onChange(num);
    }
  };

  const displayValue = value === 0 ? '' : value.toString();
  const inputId = `amount-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-sadapay-navy mb-2 tracking-wide uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-sadapay-navy/30 select-none pointer-events-none">
          {currencyPrefix}
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full h-16 pl-14 pr-4 text-2xl font-bold text-sadapay-navy bg-white border-2 border-sadapay-navy/10 focus:border-sadapay-navy focus:outline-none transition-colors placeholder:text-sadapay-navy/20"
          style={currencyPrefix.length > 1 ? { paddingLeft: `${12 + currencyPrefix.length * 10}px` } : undefined}
        />
      </div>
    </div>
  );
}
