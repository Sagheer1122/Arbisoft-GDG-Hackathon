import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'morning' | 'evening' | 'night' | 'off' | 'approved' | 'pending' | 'rejected' | 'purple' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'purple', size = 'md' }) => {
  const styles = {
    morning: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    evening: 'bg-amber-100 text-amber-800 border border-amber-200',
    night: 'bg-purple-100 text-purple-800 border border-purple-200',
    off: 'bg-gray-100 text-gray-700 border border-gray-200',
    approved: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold',
    pending: 'bg-amber-100 text-amber-800 border border-amber-300 font-bold',
    rejected: 'bg-rose-100 text-rose-800 border border-rose-300 font-bold',
    purple: 'bg-[#EDE9FE] text-[#5142C5] border border-[#5142C5]/20 font-semibold',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  return (
    <span className={`inline-flex items-center rounded-badge ${styles[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
