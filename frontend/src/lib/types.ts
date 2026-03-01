/* ------------------------------------------------------------------ */
/*  Shared TypeScript interfaces for the Ilmify frontend               */
/* ------------------------------------------------------------------ */

/** Extract an error message from any caught value */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}

/* ---- User / Auth ---- */

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "teacher" | "student" | "admin";
  avatar: string;
  isActive: boolean;
  bio: string;
  country: string;
  languages: string[];
  subjects: string[];
  hourlyRate: number;
  subscribedTeachers: string[];
  subscribers: string[];
  createdAt: string;
  updatedAt: string;
}

/* ---- Class ---- */

export interface ClassSettings {
  chat: boolean;
  screenShare: boolean;
  recording: boolean;
}

export interface ClassData {
  _id: string;
  id?: string;
  title: string;
  description: string;
  subject: string;
  teacher: User | string;
  date: string;
  time: string;
  duration: string;
  maxStudents: number;
  enrolledStudents: (User | string)[];
  attendedStudents: (User | string)[];
  meetingLink: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  timezone: string;
  classDateTime: string;
  teacherJoined: boolean;
  liveAt?: string;
  completedAt?: string;
  settings: ClassSettings;
  createdAt: string;
  updatedAt: string;
}

/* ---- Contact ---- */

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

/* ---- Reports ---- */

export interface DistributionItem {
  _id: string;
  count: number;
}

export interface AdminReportsData {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  activeClasses: number;
  completedClasses: number;
  totalEnrollments: number;
  subjectDistribution: DistributionItem[];
  statusDistribution: DistributionItem[];
}

/* ---- Dashboard Stats ---- */

export interface StudentStats {
  enrolledClasses: number;
  completedClasses: number;
  upcomingClasses: number;
  totalTeachers: number;
}

export interface AdminStats {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  activeClasses: number;
  totalContacts: number;
  completedClasses: number;
}
