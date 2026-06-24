import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, helperText, error, fullWidth = true, ...props }, ref) => {
    
    const baseStyles = "h-10 bg-neutral-100 border-[1.5px] border-transparent rounded-md px-3 font-body text-sm text-neutral-800 placeholder-neutral-400 focus:bg-white focus:outline-none transition-all";
    const widthClass = fullWidth ? 'w-full' : '';
    
    let stateStyles = "focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(26,107,219,0.12)]";
    if (error) {
      stateStyles = "bg-white border-danger-600 focus:border-danger-600 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]";
    }
    if (props.disabled) {
      stateStyles = "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-60 border-transparent focus:border-transparent focus:shadow-none";
    }

    return (
      <div className={`${widthClass} flex flex-col`}>
        {label && (
          <label className="font-display font-semibold text-[11px] text-neutral-600 uppercase tracking-[0.06em] mb-1.5">
            {label} {props.required && <span className="text-danger-600">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${stateStyles} ${widthClass} ${className}`}
          {...props}
        />
        {error && (
          <p className="font-body text-xs text-danger-600 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="font-body text-xs text-neutral-600 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
