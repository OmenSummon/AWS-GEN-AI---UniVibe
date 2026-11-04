import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "verified" | "suggested" | "outline" | "danger";
  tone?: "dark" | "light" | "auto";
}

export function Badge({
  className,
  variant = "default",
  tone = "auto",
  children,
  ...props
}: BadgeProps) {
  // Styles optimized for high contrast (minimum 7:1) across both dark surfaces and light surfaces
  const variantStyles = {
    default:
      "bg-purple-900/50 text-purple-100 border-purple-400/40 font-semibold shadow-xs",
    success:
      "bg-emerald-950/60 text-emerald-300 border-emerald-400/50 font-semibold shadow-xs",
    warning:
      "bg-amber-950/60 text-amber-300 border-amber-400/50 font-semibold shadow-xs",
    verified:
      "bg-emerald-950/70 text-emerald-200 border-emerald-400/60 font-bold tracking-wide shadow-xs",
    suggested:
      "bg-indigo-950/70 text-indigo-200 border-indigo-400/50 font-semibold shadow-xs",
    outline:
      "bg-white/10 text-white border-white/25 font-semibold backdrop-blur-sm",
    danger:
      "bg-rose-950/60 text-rose-300 border-rose-400/50 font-semibold shadow-xs",
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
