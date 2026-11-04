import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
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
    "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#446B8D]/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

  const variantStyles = {
    primary:
      "bg-[#446B8D] text-[#FEFEFE] shadow-md shadow-[#2C2B2B]/50 hover:bg-[#557FA5] hover:shadow-lg hover:shadow-[#446B8D]/25",
    secondary:
      "bg-[#353434] text-[#FEFEFE] border border-[#444343] hover:bg-[#3D3C3C] hover:border-[#E4B74A]/60",
    outline:
      "bg-transparent text-[#FEFEFE] border border-[#446B8D] hover:bg-[#446B8D]/20 hover:border-[#557FA5]",
    ghost:
      "bg-transparent text-[#D4D4D4] hover:text-[#FEFEFE] hover:bg-[#353434]",
    danger:
      "bg-[#B71C1C] text-[#FEFEFE] border border-[#B71C1C] hover:bg-[#CD2A2A] shadow-md shadow-[#B71C1C]/30",
    accent:
      "bg-[#E4B74A] text-[#2C2B2B] font-extrabold hover:bg-[#EDC460] shadow-md shadow-[#E4B74A]/25",
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
