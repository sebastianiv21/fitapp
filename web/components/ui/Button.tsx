"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantStyles = {
  primary: "bg-accent text-accent-content hover:bg-accent/90 shadow-lg shadow-accent/20",
  secondary: "bg-primary text-primary-content hover:bg-primary/90",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-content",
  ghost: "text-primary hover:bg-primary/10",
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
