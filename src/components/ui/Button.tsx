import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#6c35de] to-[#8a4bfa] text-white shadow-md shadow-purple-900/20 hover:brightness-110 hover:shadow-purple-900/35",
    secondary:
      "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm",
    outline:
      "bg-white/90 text-[#150a33] border border-gray-300 hover:border-purple-400 hover:bg-purple-50/70 hover:text-[#6c35de] shadow-xs",
    ghost:
      "bg-transparent text-gray-700 hover:text-[#150a33] hover:bg-gray-100/80",
    danger:
      "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
