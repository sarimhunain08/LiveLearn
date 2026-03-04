import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  colorClass?: string;
  description?: string;
}

export default function StatCard({ label, value, icon, trend, colorClass = "bg-primary/10 text-primary", description }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
      {/* Decorative gradient blob */}
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-none mt-2">{value}</p>
          {trend && <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1 mt-1.5">{trend}</p>}
          {description && <p className="text-[10px] text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
