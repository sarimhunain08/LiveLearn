import { useState } from "react";
import { CheckCircle, Loader2, BookOpen, CalendarDays, Clock, Users, Sparkles } from "lucide-react";
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

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxStudents, setMaxStudents] = useState(50);

  const today = new Date().toISOString().split("T")[0];
  const { toast } = useToast();
  const [attempted, setAttempted] = useState(false);

  const resetForm = () => {
    setTitle(""); setSubject(""); setCustomSubject(""); setDescription("");
    setDate(""); setTime(""); setDuration(""); setMaxStudents(50);
    setShowSuccess(false); setAttempted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const finalSubject = subject === "other" ? customSubject.trim() : subject;
    if (!finalSubject || !duration) {
      toast({ title: "Missing fields", description: `Please select ${!finalSubject ? "a subject" : ""}${!finalSubject && !duration ? " and " : ""}${!duration ? "a duration" : ""}.`, variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await api.createClass({ title, subject: finalSubject, description, date, time, duration, maxStudents, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      setShowSuccess(true);
      toast({ title: "Class created successfully!" });
    } catch (error: unknown) {
      toast({ title: "Failed to create class", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <DashboardLayout navItems={navItems} title="Create Class">
        <div className="mx-auto max-w-lg text-center py-20 animate-fade-in">
          <div className="relative mx-auto mb-8 w-fit">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 shadow-md">
              <Sparkles className="h-4 w-4 text-yellow-800" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Class Created!</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Your class has been scheduled. Students can now discover and enroll.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="rounded-xl h-11 px-6" onClick={resetForm}>Create Another</Button>
            <Button className="gradient-primary text-primary-foreground border-0 rounded-xl h-11 px-6 shadow-lg shadow-primary/20" onClick={() => window.history.back()}>View Classes</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Create Class">
      <div className="mx-auto max-w-2xl pb-8">
        {/* Page Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-500/5 p-6 border border-primary/10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 shadow-lg shadow-primary/25">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Create New Class</h2>
              <p className="text-sm text-muted-foreground">Fill in the details to schedule your next class</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-primary/10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Basic Information</h3>
                <p className="text-[10px] text-muted-foreground">Title, subject and description</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Class Title <span className="text-destructive">*</span></label>
                <Input placeholder="e.g., Quran Recitation - Surah Baqarah" className="h-11 rounded-xl bg-background/50 border-border/50 focus:border-primary/30 focus:bg-background transition-all" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Subject <span className="text-destructive">*</span></label>
                  <Select value={subject} onValueChange={(val) => { setSubject(val); if (val !== "other") setCustomSubject(""); }}>
                    <SelectTrigger className={`h-11 rounded-xl bg-background/50 border-border/60 ${attempted && !subject ? "ring-2 ring-destructive" : ""}`}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {subjects.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {subject === "other" && (
                    <Input placeholder="Enter your subject name" className="mt-2 h-11 rounded-xl bg-background/50 border-border/60" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} required />
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /> Max Students</span>
                  </label>
                  <Input type="number" className="h-11 rounded-xl bg-background/50 border-border/60" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} min={1} max={500} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Description <span className="text-muted-foreground text-xs font-normal">(optional)</span></label>
                <Textarea className="rounded-xl bg-background/50 border-border/60 focus:bg-background transition-colors min-h-[80px]" placeholder="Describe what students will learn..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-violet-500/10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <CalendarDays className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Schedule</h3>
                <p className="text-[10px] text-muted-foreground">Date, time and duration</p>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> Date <span className="text-destructive">*</span></span>
                </label>
                <Input type="date" className="h-11 rounded-xl bg-background/50 border-border/60" value={date} onChange={(e) => setDate(e.target.value)} min={today} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> Time <span className="text-destructive">*</span></span>
                </label>
                <Input type="time" className="h-11 rounded-xl bg-background/50 border-border/60" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> Duration <span className="text-destructive">*</span></span>
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className={`h-11 rounded-xl bg-background/50 border-border/60 ${attempted && !duration ? "ring-2 ring-destructive" : ""}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {["30 min", "45 min", "60 min", "90 min", "120 min"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
            <Button type="button" variant="outline" className="rounded-xl h-11" onClick={() => window.history.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="gradient-primary text-primary-foreground border-0 px-10 h-11 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</> : "Create Class"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
