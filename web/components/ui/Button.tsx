"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantStyles = {
  primary: "btn-accent",
  secondary: "btn-primary",
  outline: "btn-outline btn-primary",
  ghost: "btn-ghost btn-primary",
};

const sizeStyles = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
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
        "btn rounded-xl font-medium transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && "btn-disabled",
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
