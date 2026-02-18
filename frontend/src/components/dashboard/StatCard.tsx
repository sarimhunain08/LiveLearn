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
    <div className="stat-card flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
        {trend && <p className="mt-1 text-xs text-success font-medium">{trend}</p>}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
}
