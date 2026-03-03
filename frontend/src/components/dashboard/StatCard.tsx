import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  colorClass?: string;
}

export default function StatCard({ label, value, icon, trend, colorClass = "bg-primary/10 text-primary" }: StatCardProps) {
  return (
    <div className="stat-card group flex items-start justify-between hover:border-primary/20">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</p>
        {trend && <p className="mt-1 text-xs text-success font-semibold flex items-center gap-1">{trend}</p>}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
    </div>
  );
}
