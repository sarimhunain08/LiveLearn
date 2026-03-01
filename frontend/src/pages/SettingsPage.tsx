import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, User } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { teacherNav, studentNav, adminNav } from "@/lib/navItems";
import { getErrorMessage } from "@/lib/types";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const navItems = location.pathname.startsWith("/teacher") ? teacherNav :
    location.pathname.startsWith("/admin") ? adminNav : studentNav;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (name.trim() && name !== user?.name) payload.name = name.trim();
      if (bio.trim()) payload.bio = bio.trim();

      if (Object.keys(payload).length === 0) {
        toast({ title: "No changes to save" });
        setSaving(false);
        return;
      }

      await api.updateProfile(payload);
      await refreshUser();
      toast({ title: "Profile updated!" });
    } catch (err: unknown) {
      toast({ title: "Update failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-lg font-bold text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <Input defaultValue={user?.email || ""} disabled />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Bio</label>
              <Textarea placeholder="Tell us about yourself..." rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <Button
              className="gradient-primary text-primary-foreground border-0"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
