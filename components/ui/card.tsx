import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverGlow = false, children, ...props }, ref) => {
    
    // Mouse tracker to support the cursor spotlight effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      currentTarget.style.setProperty("--mouse-x", `${x}px`);
      currentTarget.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative overflow-hidden rounded-[24px] border border-white/40 bg-white/45 p-5 backdrop-blur-[24px] transition-all duration-300 shadow-[0_8px_30px_rgba(100,71,54,0.01)] text-[#4E3629] group/card",
          hoverGlow && "hover:border-[#4E3629]/20 hover:shadow-[0_8px_30px_rgba(100,71,54,0.03)] hover:bg-white/55",
          className
        )}
        {...props}
      >
        {/* Cursor Spotlight Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(
              280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
              rgba(199, 163, 126, 0.08),
              transparent 75%
            )`
          }}
        />
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 
    className={cn("text-base font-extrabold tracking-tight text-[#4E3629]", className)} 
    style={{ fontFamily: "'Clash Display', Inter, system-ui, sans-serif" }} 
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-xs text-[#4E3629]/72 font-medium", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative z-10", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-4 flex items-center pt-2 border-t border-[#4E3629]/10", className)} {...props}>
    {children}
  </div>
);
