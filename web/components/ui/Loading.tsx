"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
  xl: "loading-lg w-16 h-16",
};

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span className={cn("loading loading-spinner text-accent", sizeStyles[size], className)} />
  );
}

export function Loading({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center justify-center">
      <Spinner size={size} />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Spinner size="xl" />
        <p className="text-base-content font-medium">Loading...</p>
      </motion.div>
    </div>
  );
}
