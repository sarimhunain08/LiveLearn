import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Mail,
  Loader2, AlertCircle, Trash2, Eye, X, MessageSquare, Clock
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Messages", path: "/admin/contacts", icon: <Mail className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const subjectLabels: Record<string, string> = {
  general: "General Inquiry",
  pricing: "Pricing & Plans",
  technical: "Technical Support",
  billing: "Billing Issue",
  "become-tutor": "Become a Tutor",
  feedback: "Feedback",
  other: "Other",
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminContacts({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setContacts(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleView = async (contact: any) => {
    setSelectedContact(contact);
    // Mark as read if new
    if (contact.status === "new") {
      try {
        await api.updateAdminContact(contact._id, { status: "read" });
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, status: "read" } : c))
        );
      } catch {}
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await api.updateAdminContact(id, { status });
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      if (selectedContact?._id === id) {
        setSelectedContact((prev: any) => ({ ...prev, status }));
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact message? This cannot be undone.")) return;
    setActionLoading(id);
    try {
      await api.deleteAdminContact(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (selectedContact?._id === id) setSelectedContact(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Contact Messages">
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{contacts.length} message{contacts.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Detail modal/panel */}
      {selectedContact && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card relative">
          <button
            className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setSelectedContact(null)}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{selectedContact.name}</h3>
                <a href={`mailto:${selectedContact.email}`} className="text-sm text-primary hover:underline">
                  {selectedContact.email}
                </a>
              </div>
              <StatusBadge status={selectedContact.status} />
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                {subjectLabels[selectedContact.subject] || selectedContact.subject}
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{selectedContact.message}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {new Date(selectedContact.createdAt).toLocaleString()}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <a href={`mailto:${selectedContact.email}`}>
                <Button size="sm" className="gradient-primary text-primary-foreground border-0" onClick={() => handleStatusChange(selectedContact._id, "replied")}>
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Reply via Email
                </Button>
              </a>
              <Select
                value={selectedContact.status}
                onValueChange={(v) => handleStatusChange(selectedContact._id, v)}
              >
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost" size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(selectedContact._id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-destructive font-medium">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchContacts}>
            Retry
          </Button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No contact messages{statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Mobile card view */}
          <div className="sm:hidden divide-y divide-border">
            {contacts.map((c) => (
              <div
                key={c._id}
                className={`p-4 space-y-2 cursor-pointer transition-colors hover:bg-muted/50 ${c.status === "new" ? "bg-primary/5" : ""}`}
                onClick={() => handleView(c)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {c.status === "new" && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <span className="font-medium text-foreground text-sm truncate">{c.name}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                <p className="text-xs text-muted-foreground">
                  {subjectLabels[c.subject] || c.subject} · {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-foreground/70 line-clamp-2">{c.message}</p>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id} className={c.status === "new" ? "bg-primary/5" : ""}>
                    <td className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {c.status === "new" && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                        {c.name}
                      </div>
                    </td>
                    <td className="text-muted-foreground">{c.email}</td>
                    <td className="text-muted-foreground text-xs">{subjectLabels[c.subject] || c.subject}</td>
                    <td className="text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => handleView(c)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={actionLoading === c._id}
                          onClick={() => handleDelete(c._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
