import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-[#5142C5] hover:bg-[#3D2DA8] text-white shadow-nurse-sm hover:shadow-nurse-md focus:ring-[#5142C5]',
    secondary:
      'bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5142C5] focus:ring-[#5142C5]',
    outline:
      'border-2 border-[#E7E7F0] hover:border-[#5142C5] text-[#16162A] hover:text-[#5142C5] bg-white focus:ring-[#5142C5]',
    ghost:
      'text-[#707080] hover:text-[#16162A] hover:bg-[#EDE9FE]/50 focus:ring-[#5142C5]',
    danger:
      'bg-[#EF5350] hover:bg-[#D32F2F] text-white shadow-sm focus:ring-[#EF5350]',
    success:
      'bg-[#39B879] hover:bg-[#2E9962] text-white shadow-sm focus:ring-[#39B879]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
