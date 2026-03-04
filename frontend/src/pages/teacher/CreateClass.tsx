import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { teacherNav as navItems } from "@/lib/navItems";
import { getErrorMessage } from "@/lib/types";

const subjects = [
  "Quran", "Tajweed", "Islamic Studies", "Arabic", "Urdu",
  "Math", "Science", "English", "History", "Programming",
  "Art", "Music", "Other",
];

export default function CreateClass() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxStudents, setMaxStudents] = useState(50);

  // Today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split("T")[0];

  const { toast } = useToast();
  const [attempted, setAttempted] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setCustomSubject("");
    setDescription("");
    setDate("");
    setTime("");
    setDuration("");
    setMaxStudents(50);
    setShowSuccess(false);
    setAttempted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);

    const finalSubject = subject === "other" ? customSubject.trim() : subject;
    if (!finalSubject || !duration) {
      toast({
        title: "Missing fields",
        description: `Please select ${!finalSubject ? "a subject" : ""}${!finalSubject && !duration ? " and " : ""}${!duration ? "a duration" : ""}.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const classData = {
        title,
        subject: finalSubject,
        description,
        date,
        time,
        duration,
        maxStudents,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      await api.createClass(classData);
      setShowSuccess(true);
      toast({ title: "Class created successfully!" });
    } catch (error: unknown) {
      toast({
        title: "Failed to create class",
        description: getErrorMessage(error),
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
      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Class Title *</label>
                <Input placeholder="e.g., Introduction to Calculus" className="h-11 rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Subject *</label>
                  <Select value={subject} onValueChange={(val) => { setSubject(val); if (val !== "other") setCustomSubject(""); }}>
                    <SelectTrigger className={`h-11 rounded-xl ${attempted && !subject ? "ring-2 ring-destructive" : ""}`}><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {subject === "other" && (
                    <Input
                      placeholder="Enter your subject"
                      className="mt-2 h-11 rounded-xl"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Max Students</label>
                  <Input type="number" className="h-11 rounded-xl" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} min={1} max={500} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                <Textarea className="rounded-xl" placeholder="Describe what students will learn..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Schedule</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Date *</label>
                <Input type="date" className="h-11 rounded-xl" value={date} onChange={(e) => setDate(e.target.value)} min={today} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Time *</label>
                <Input type="time" className="h-11 rounded-xl" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Duration *</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className={`h-11 rounded-xl ${attempted && !duration ? "ring-2 ring-destructive" : ""}`}><SelectValue placeholder="Duration" /></SelectTrigger>
                  <SelectContent>
                    {["30 min", "45 min", "60 min", "90 min", "120 min"].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h2 className="mb-3 text-lg font-semibold text-foreground">How it works</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Max Students</strong> limits how many students can enroll. Once full, no more enrollments.</li>
              <li>• <strong>Duration</strong> determines when the class auto-completes. If the teacher doesn't join, it auto-cancels.</li>
              <li>• Chat, screen sharing, and recording are managed automatically during the live meeting.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => window.history.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="gradient-primary text-primary-foreground border-0 px-8 h-11 rounded-xl font-semibold shadow-lg shadow-primary/20">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Class"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
