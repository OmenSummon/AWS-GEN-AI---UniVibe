import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "verified" | "suggested" | "outline" | "danger" | "accent";
  tone?: "dark" | "light" | "auto";
}

export function Badge({
  className,
  variant = "default",
  tone = "auto",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-[#446B8D]/25 text-[#FEFEFE] border-[#446B8D]/50 font-semibold shadow-xs",
    success:
      "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 font-semibold shadow-xs",
    warning:
      "bg-[#E4B74A]/20 text-[#E4B74A] border-[#E4B74A]/40 font-semibold shadow-xs",
    verified:
      "bg-[#446B8D]/30 text-[#FEFEFE] border-[#E4B74A] font-bold tracking-wide shadow-xs",
    suggested:
      "bg-[#353434] text-[#D4D4D4] border-[#444343] font-semibold shadow-xs",
    outline:
      "bg-transparent text-[#FEFEFE] border-[#444343] font-semibold",
    danger:
      "bg-[#B71C1C]/25 text-[#FF8E8E] border-[#B71C1C]/60 font-semibold shadow-xs",
    accent:
      "bg-[#E4B74A]/25 text-[#E4B74A] border-[#E4B74A]/50 font-bold shadow-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
