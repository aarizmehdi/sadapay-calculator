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
      <div className="flex items-stretch border-2 border-sadapay-navy/10 focus-within:border-sadapay-navy transition-colors bg-white">
        <span className="flex items-center px-4 text-2xl font-bold text-sadapay-navy/30 select-none shrink-0">
          {currencyPrefix}
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder="0.00"
          className="flex-1 h-16 pr-4 text-2xl font-bold text-sadapay-navy bg-transparent focus:outline-none placeholder:text-sadapay-navy/20 min-w-0"
        />
      </div>
    </div>
  );
}
