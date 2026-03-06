import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  glass = false,
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        glass ? "glass-card" : "bg-white shadow-lg shadow-[#0f3d2e]/5",
        hover && "transition-all duration-300 hover:shadow-xl hover:shadow-[#0f3d2e]/10 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("font-display text-xl font-semibold text-[#0f3d2e]", className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}
