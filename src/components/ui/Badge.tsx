import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "verified" | "suggested" | "outline";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-violet/15 text-lavender-300 border-violet/30",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    verified: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-semibold tracking-wide",
    suggested: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    outline: "bg-transparent text-gray-300 border-white/15",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

