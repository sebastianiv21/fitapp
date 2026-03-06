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
  error: "bg-red-50 border-red-200 text-red-700",
  success: "bg-green-50 border-green-200 text-green-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
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
      className={cn("rounded-xl border px-4 py-3 flex items-start gap-3", typeStyles[type])}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
