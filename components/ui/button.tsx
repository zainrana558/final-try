import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[13px] font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-1 focus-visible:ring-purple-500",
  {
    variants: {
      variant: {
        default:   "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_28px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98]",
        outline:   "border border-[#2a2a2a] bg-transparent text-zinc-400 hover:text-white hover:border-[#3a3a3a] hover:bg-white/[0.03] active:scale-[0.98]",
        ghost:     "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] active:scale-[0.98]",
        secondary: "bg-[#0f0f0f] border border-[#1f1f1f] text-zinc-300 hover:text-white hover:bg-[#161616] active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 px-3 text-[12px]",
        lg:      "h-11 px-6",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
