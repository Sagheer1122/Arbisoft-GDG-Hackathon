import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#707080] mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[#707080] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-white border border-[#E7E7F0] rounded-button ${
              icon ? 'pl-10' : 'px-3.5'
            } py-2.5 text-sm text-[#16162A] placeholder-[#9E9EAE] focus:outline-none focus:border-[#5142C5] focus:ring-2 focus:ring-[#5142C5]/20 transition-all ${
              error ? 'border-[#EF5350] focus:ring-[#EF5350]/20' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#EF5350] mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
