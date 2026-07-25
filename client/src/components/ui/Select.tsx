import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#707080] mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-white border border-[#E7E7F0] rounded-button px-3.5 py-2.5 text-sm text-[#16162A] focus:outline-none focus:border-[#5142C5] focus:ring-2 focus:ring-[#5142C5]/20 transition-all ${
            error ? 'border-[#EF5350]' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#EF5350] mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
