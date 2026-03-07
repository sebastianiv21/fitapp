"use client";

import { AlertCircle, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AlertProps {
  type?: "error" | "success" | "info";
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  error: "alert-error",
  success: "alert-success",
  info: "alert-info",
};

const typeIcons = {
  error: AlertCircle,
  success: CheckCircle,
  info: AlertCircle,
};

export function Alert({ type = "error", message, onClose }: AlertProps) {
  const Icon = typeIcons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("alert rounded-xl", typeStyles[type])}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex-1 text-sm">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
