import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import BecomeATutor from "./pages/BecomeATutor";
import FindTutors from "./pages/FindTutors";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateClass from "./pages/teacher/CreateClass";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudents from "./pages/teacher/TeacherStudents";

import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseTeachers from "./pages/student/BrowseTeachers";
import StudentClasses from "./pages/student/StudentClasses";
import ClassDetail from "./pages/student/ClassDetail";
import TeacherProfile from "./pages/student/TeacherProfile";
import MyTeachers from "./pages/student/MyTeachers";
import MeetingRoom from "./pages/MeetingRoom";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminReports from "./pages/admin/AdminReports";

import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/become-a-tutor" element={<BecomeATutor />} />
            <Route path="/find-tutors" element={<FindTutors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Teacher */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/create-class" element={<CreateClass />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/settings" element={<SettingsPage />} />
            <Route path="/teacher/meeting/:id" element={<MeetingRoom />} />

            {/* Student */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/browse" element={<BrowseTeachers />} />
            <Route path="/student/my-teachers" element={<MyTeachers />} />
            <Route path="/student/teacher/:id" element={<TeacherProfile />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/class/:id" element={<ClassDetail />} />
            <Route path="/student/meeting/:id" element={<MeetingRoom />} />
            <Route path="/student/settings" element={<SettingsPage />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<SettingsPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
