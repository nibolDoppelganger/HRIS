import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', icon, children, fullWidth = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-display font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-60 disabled:cursor-not-allowed";
    
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-brand-blue text-white hover:bg-[#155BB8] hover:shadow-sm active:bg-[#1052A8] border border-transparent",
      secondary: "bg-white text-brand-blue border-[1.5px] border-brand-blue hover:bg-brand-blue-light active:bg-[#D4E9FF]",
      ghost: "bg-transparent text-neutral-600 border-[1.5px] border-neutral-200 hover:bg-neutral-100",
      danger: "bg-danger-600 text-white border border-transparent hover:bg-[#B91C1C]",
      link: "bg-transparent text-brand-blue hover:underline p-0 border-transparent",
    };
    
    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-4 text-sm",
      md: "h-10 px-5 text-[14px]",
      lg: "h-12 px-6 text-[15px]",
      icon: "w-9 h-9 p-0 bg-neutral-100 hover:bg-neutral-200 text-neutral-800", // 36x36px icon button per design
    };
    
    // Override sizing if it's a link variant
    const sizeClass = variant === 'link' ? '' : sizes[size];
    const widthClass = fullWidth ? 'w-full' : '';
    
    // special case for icon variant overriding base variant if needed
    const variantClass = size === 'icon' && variant === 'primary' ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-none' : variants[variant];
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
        {...props}
      >
        {icon && <span className={children ? 'mr-2' : ''}>{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
