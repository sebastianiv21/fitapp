"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: {
    href: string;
    text: string;
  };
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#ccff00] rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#0f3d2e]" />
              </div>
              <span className="font-display text-2xl font-bold text-[#0f3d2e]">
                FitApp
              </span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-[#0f3d2e] mb-2">
              {title}
            </h1>
            <p className="text-[#0f3d2e]/60">{subtitle}</p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            {children}

            <div className="mt-6 text-center">
              <p className="text-[#0f3d2e]/60">
                {footerText}{" "}
                <Link
                  href={footerLink.href}
                  className="text-[#207d57] font-medium hover:underline"
                >
                  {footerLink.text}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
