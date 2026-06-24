import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'gold' | 'neutral';
  className?: string;
}

export const StatWidget: React.FC<StatWidgetProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'primary',
  className = '' 
}) => {
  
  const variants = {
    primary: {
      border: 'before:bg-brand-blue',
      iconBg: 'bg-brand-blue-light',
      iconColor: 'text-brand-blue'
    },
    success: {
      border: 'before:bg-success-600',
      iconBg: 'bg-success-50',
      iconColor: 'text-success-600'
    },
    warning: {
      border: 'before:bg-warning-600',
      iconBg: 'bg-warning-50',
      iconColor: 'text-warning-600'
    },
    info: {
      border: 'before:bg-info-600',
      iconBg: 'bg-info-50',
      iconColor: 'text-info-600'
    },
    gold: {
      border: 'before:bg-brand-gold',
      iconBg: 'bg-brand-gold-light',
      iconColor: 'text-brand-gold'
    },
    neutral: {
      border: 'before:bg-neutral-chip-600',
      iconBg: 'bg-neutral-chip-50',
      iconColor: 'text-neutral-chip-600'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`bg-white border border-neutral-200 rounded-[10px] p-5 relative overflow-hidden flex flex-col justify-between min-h-[120px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-[10px] ${currentVariant.border} ${className}`}>
      
      <div className="flex justify-between items-start mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentVariant.iconBg} ${currentVariant.iconColor}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`text-[11px] font-semibold flex items-center gap-1 ${trend.isPositive ? 'text-success-600' : 'text-danger-600'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div>
        <div className="font-display font-bold text-[28px] leading-[1.1] text-neutral-950 tracking-[-0.02em]">
          {value}
        </div>
        <div className="font-body text-xs font-medium text-neutral-600 mt-1">
          {title}
        </div>
      </div>
      
    </div>
  );
};
