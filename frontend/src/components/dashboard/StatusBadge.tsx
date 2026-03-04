const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20",
  live: "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  cancelled: "bg-gray-500/10 text-gray-500 ring-gray-500/20",
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  suspended: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  pending: "bg-gray-500/10 text-gray-500 ring-gray-500/20",
  enrolled: "bg-primary/10 text-primary ring-primary/20",
  new: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
  read: "bg-gray-500/10 text-gray-500 ring-gray-500/20",
  replied: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
  closed: "bg-gray-500/10 text-gray-500 ring-gray-500/20",
};

export default function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[lower] || "bg-gray-500/10 text-gray-500 ring-gray-500/20"}`}>
      {lower === "live" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-live" />}
      {status}
    </span>
  );
}
