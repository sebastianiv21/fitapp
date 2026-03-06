"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantStyles = {
  primary: "bg-[#ccff00] text-[#0f3d2e] hover:bg-[#b3e600] shadow-lg shadow-[#ccff00]/20",
  secondary: "bg-[#0f3d2e] text-[#faf9f6] hover:bg-[#145239]",
  outline: "border-2 border-[#0f3d2e] text-[#0f3d2e] hover:bg-[#0f3d2e] hover:text-[#faf9f6]",
  ghost: "text-[#0f3d2e] hover:bg-[#0f3d2e]/10",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "active:scale-[0.98] hover:scale-[1.02]",
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && "opacity-60 cursor-not-allowed hover:scale-100 active:scale-100",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
