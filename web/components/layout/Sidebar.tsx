"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, Dumbbell, LayoutDashboard, TrendingUp, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/diet", label: "Diet Plan", icon: Apple },
  { href: "/dashboard/workout", label: "Workout", icon: Dumbbell },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-card border-r border-neutral min-h-screen pt-20 pb-6 px-4">
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-accent-content"
                    : "text-base-content/70 hover:bg-primary/5 hover:text-base-content"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-[#e5e4de]">
        <Link href="/dashboard/profile">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0f3d2e]/70 hover:bg-[#0f3d2e]/5 hover:text-[#0f3d2e] transition-all">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
