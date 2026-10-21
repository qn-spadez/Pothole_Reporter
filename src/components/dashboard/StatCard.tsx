import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  accentBorder?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-slate-700',
  iconBg = 'bg-slate-100',
  accentBorder,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`p-5 transition-all duration-150 ${
        onClick
          ? 'cursor-pointer hover:border-slate-300 hover:shadow-md active:scale-[0.99]'
          : ''
      } ${accentBorder || ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};
