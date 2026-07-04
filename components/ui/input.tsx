import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-xl border border-white/5 bg-black/30 px-4 py-2 text-sm text-white placeholder-neutral-500/80 outline-none backdrop-blur-md transition-all duration-200 focus:border-white/20 focus:bg-black/50 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
