"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full form-control">
        {label && (
          <label className="label text-sm font-medium text-base-content mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "select select-bordered select-accent w-full rounded-xl",
            "focus:outline-none transition-all duration-200 cursor-pointer",
            error && "select-error",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
