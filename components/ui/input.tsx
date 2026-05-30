import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-xl border bg-transparent px-4 py-2.5 text-[13px] text-white outline-none transition-all duration-200",
        "border-[#1f1f1f] bg-[#0a0a0a] placeholder:text-zinc-700",
        "focus:border-[#3a3a3a] focus:ring-1 focus:ring-purple-500/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
