import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', gradient = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-card p-5 transition-all duration-200 ${
        gradient
          ? 'bg-gradient-to-br from-[#5142C5] to-[#3D2DA8] text-white shadow-nurse-md'
          : 'bg-white border border-[#E7E7F0] shadow-nurse-sm hover:shadow-nurse-md'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
