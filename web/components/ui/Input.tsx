"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#0f3d2e] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-white border-2 border-[#e5e4de] rounded-xl 
            text-[#0f3d2e] placeholder:text-[#0f3d2e]/40
            focus:outline-none focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20
            transition-all duration-200
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
