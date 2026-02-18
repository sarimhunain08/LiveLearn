import { useState } from "react";
import { Home, Plus, BookOpen, Users, DollarSign, Settings, CheckCircle, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const navItems = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Create Class", path: "/teacher/create-class", icon: <Plus className="h-4 w-4" /> },
  { label: "My Classes", path: "/teacher/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/teacher/students", icon: <Users className="h-4 w-4" /> },
  { label: "Earnings", path: "#", icon: <DollarSign className="h-4 w-4 opacity-40" /> },
  { label: "Settings", path: "/teacher/settings", icon: <Settings className="h-4 w-4" /> },
];

const subjects = ["Math", "Science", "English", "History", "Art", "Music", "Programming", "Arabic"];

export default function CreateClass() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxStudents, setMaxStudents] = useState(50);
  const [chat, setChat] = useState(true);
  const [screenShare, setScreenShare] = useState(true);
  const [recording, setRecording] = useState(false);

  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setDescription("");
    setDate("");
    setTime("");
    setDuration("");
    setMaxStudents(50);
    setChat(true);
    setScreenShare(true);
    setRecording(false);
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const classData = {
        title,
        subject,
        description,
        date: new Date(date).toISOString(),
        time,
        duration,
        maxStudents,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        classDateTime: new Date(`${date}T${time}:00`).toISOString(),
        settings: { chat, screenShare, recording },
      };

      await api.createClass(classData);
      setShowSuccess(true);
      toast({ title: "Class created successfully!" });
    } catch (error: any) {
      toast({
        title: "Failed to create class",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <DashboardLayout navItems={navItems} title="Create Class">
        <div className="mx-auto max-w-md text-center py-16 animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Class Created Successfully!</h2>
          <p className="text-muted-foreground mb-6">Your class has been scheduled and students can now enroll.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={resetForm}>Create Another</Button>
            <Button className="gradient-primary text-primary-foreground border-0" onClick={() => window.history.back()}>
              View Classes
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Create Class">
      <div className="mx-auto max-w-2xl px-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Class Title *</label>
                <Input placeholder="e.g., Introduction to Calculus" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Subject *</label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Max Students</label>
                  <Input type="number" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} min={1} max={500} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                <Textarea placeholder="Describe what students will learn..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Schedule</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Date *</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Time *</label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Duration *</label>
                <Select value={duration} onValueChange={setDuration} required>
                  <SelectTrigger><SelectValue placeholder="Duration" /></SelectTrigger>
                  <SelectContent>
                    {["30 min", "45 min", "60 min", "90 min", "120 min"].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Meeting Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Enable Chat</p>
                  <p className="text-xs text-muted-foreground">Allow students to send messages</p>
                </div>
                <Switch checked={chat} onCheckedChange={setChat} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Screen Sharing</p>
                  <p className="text-xs text-muted-foreground">Share your screen during class</p>
                </div>
                <Switch checked={screenShare} onCheckedChange={setScreenShare} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Allow Recording</p>
                  <p className="text-xs text-muted-foreground">Record the session for later</p>
                </div>
                <Switch checked={recording} onCheckedChange={setRecording} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !title || !subject || !date || !time || !duration} className="gradient-primary text-primary-foreground border-0 px-8">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Class"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
