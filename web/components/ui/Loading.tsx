"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

function Spinner({ size = "md", className, animate = true }: SpinnerProps) {
  const spinnerClass = cn(
    sizeStyles[size],
    "border-4 border-neutral border-t-accent rounded-full",
    animate && "animate-spin",
    className
  );

  return <div className={spinnerClass} />;
}

export function Loading({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Spinner size={size} animate={false} />
      </motion.div>
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
