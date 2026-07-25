import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: string;
  color?: 'purple' | 'green' | 'amber' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = 'purple',
}) => {
  const iconColors = {
    purple: 'bg-[#EDE9FE] text-[#5142C5]',
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-semibold text-[#707080] uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-[#16162A] mt-1">{value}</h3>
        {description && <p className="text-xs text-[#707080] mt-1">{description}</p>}
        {trend && <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">{trend}</span>}
      </div>
      {icon && <div className={`p-3.5 rounded-2xl ${iconColors[color]}`}>{icon}</div>}
    </Card>
  );
};
