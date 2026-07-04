import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#C7A37E] text-white hover:bg-[#C7A37E]/90 shadow-sm",
        destructive: "bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30",
        outline: "border border-white/10 bg-transparent text-white hover:bg-white/5",
        secondary: "bg-white/10 hover:bg-[#F7F3EC]/15 text-white border border-white/10",
        ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
        link: "text-[#C7A37E] underline-offset-4 hover:underline",
        primary: "bg-white text-black hover:bg-neutral-200 shadow-sm", // compatibility
        danger: "bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30", // compatibility
        glow: "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]", // compatibility
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3 py-1.5 text-xs",
        md: "h-10 px-4 py-2 text-sm", // compatibility
        lg: "h-11 rounded-xl px-6 py-3 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
