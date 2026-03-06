"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full form-control">
        {label && (
          <label className="label text-sm font-medium text-base-content mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "input input-bordered input-accent w-full rounded-xl",
            "focus:outline-none transition-all duration-200",
            error && "input-error",
            className
          )}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
