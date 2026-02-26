const statusStyles: Record<string, string> = {
  scheduled: "bg-primary/10 text-primary",
  live: "bg-destructive/10 text-destructive",
  completed: "bg-success/10 text-success",
  cancelled: "bg-muted text-muted-foreground",
  active: "bg-success/10 text-success",
  suspended: "bg-warning/10 text-warning",
  pending: "bg-muted text-muted-foreground",
  enrolled: "bg-primary/10 text-primary",
  new: "bg-primary/10 text-primary",
  read: "bg-muted text-muted-foreground",
  replied: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

export default function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[lower] || "bg-muted text-muted-foreground"}`}>
      {lower === "live" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-live" />}
      {status}
    </span>
  );
}
