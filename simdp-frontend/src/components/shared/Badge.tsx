import React from 'react';

type BadgeStatus = 'Tetap' | 'Kontrak' | 'Relawan' | 'Nonaktif' | 'Info' | 'Warning' | 'Success' | 'Draft';

interface BadgeProps {
  status: BadgeStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let bg = 'bg-neutral-100';
  let text = 'text-neutral-600';
  let dot = 'bg-neutral-600';

  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'tetap' || normalizedStatus === 'approved' || normalizedStatus === 'success') {
    bg = 'bg-success-50';
    text = 'text-success-600';
    dot = 'bg-success-600';
  } else if (normalizedStatus === 'kontrak' || normalizedStatus === 'pending' || normalizedStatus === 'warning') {
    bg = 'bg-warning-50';
    text = 'text-warning-600';
    dot = 'bg-warning-600';
  } else if (normalizedStatus === 'relawan' || normalizedStatus === 'draft') {
    bg = 'bg-neutral-chip-50';
    text = 'text-neutral-chip-600';
    dot = 'bg-neutral-chip-600';
  } else if (normalizedStatus === 'nonaktif' || normalizedStatus === 'rejected' || normalizedStatus === 'danger') {
    bg = 'bg-danger-50';
    text = 'text-danger-600';
    dot = 'bg-danger-600';
  } else if (normalizedStatus === 'info' || normalizedStatus === 'approved_l1') {
    bg = 'bg-info-50';
    text = 'text-info-600';
    dot = 'bg-info-600';
  }

  return (
    <span className={`inline-flex items-center h-6 px-2.5 gap-1.5 rounded bg-opacity-100 font-display font-medium text-xs whitespace-nowrap ${bg} ${text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
};
