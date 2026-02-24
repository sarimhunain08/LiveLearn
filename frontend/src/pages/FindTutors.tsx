import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Globe,
  Languages,
  BookOpen,
  Users,
  GraduationCap,
  ChevronDown,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  languages: string[];
  subjects: string[];
  hourlyRate: number;
  classCount: number;
  subscriberCount: number;
}

const SUBJECT_OPTIONS = [
  "Mathematics","Physics","Chemistry","Biology","Computer Science","English Language","English Literature",
  "Urdu","Islamiat","Pakistan Studies","History","Geography","Economics","Accounting","Business Studies",
  "Psychology","Programming","Web Development","Data Science","French","German","Spanish","Arabic",
];

const COUNTRY_OPTIONS = [
  "Pakistan","United States","United Kingdom","India","Canada","Australia","Germany","France",
  "Saudi Arabia","UAE","Turkey","Malaysia","China","Japan","South Korea","Brazil","Egypt","Nigeria","South Africa",
];

const LANGUAGE_OPTIONS = [
  "English","Urdu","Hindi","Arabic","French","German","Spanish","Chinese","Japanese","Korean","Turkish","Portuguese","Punjabi",
];

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = searchTerm
    ? options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleSelect = (val: string) => {
    onChange(val);
    setSearchTerm("");
    setOpen(false);
  };

  const handleCustomApply = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm.trim());
      setSearchTerm("");
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
          value
            ? "border-primary bg-primary/5 text-foreground font-medium"
            : "border-border bg-card text-muted-foreground hover:border-foreground/30"
        }`}
      >
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="max-w-[120px] truncate">{value || placeholder}</span>
        {value ? (
          <X
            className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
          />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearchTerm(""); }} />
          <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border bg-card shadow-lg">
            {/* Search input */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder={`Type to search or add custom...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (filtered.length > 0) {
                        handleSelect(filtered[0]);
                      } else {
                        handleCustomApply();
                      }
                    }
                  }}
                  className="w-full rounded-lg bg-muted/50 py-2 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              <button
                onClick={() => handleSelect("")}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted ${!value ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                Any
              </button>
              {filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted ${value === opt ? "text-primary font-medium bg-primary/5" : "text-foreground"}`}
                >
                  {opt}
                </button>
              ))}
              {searchTerm && filtered.length === 0 && (
                <button
                  onClick={handleCustomApply}
                  className="w-full px-4 py-2.5 text-left text-sm text-primary font-medium hover:bg-muted"
                >
                  Use &quot;{searchTerm}&quot;
                </button>
              )}
              {searchTerm && filtered.length > 0 && !filtered.includes(searchTerm) && (
                <button
                  onClick={handleCustomApply}
                  className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted border-t border-border"
                >
                  Use custom: &quot;{searchTerm}&quot;
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AvatarPlaceholder = ({ name }: { name: string }) => {
  const colors = [
    "from-blue-400 to-blue-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-600",
    "from-orange-400 to-orange-600",
    "from-pink-400 to-pink-600",
    "from-cyan-400 to-cyan-600",
    "from-rose-400 to-rose-600",
  ];
  const colorIdx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center`}>
      <span className="text-white font-bold text-3xl sm:text-4xl select-none">{initials}</span>
    </div>
  );
};

export default function FindTutors() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");

  const getProfilePath = (teacherId: string) => {
    if (isAuthenticated && user?.role === "student") {
      return `/student/teacher/${teacherId}`;
    }
    return `/login?redirect=/student/teacher/${teacherId}`;
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (subject) params.subject = subject;
      if (country) params.country = country;
      if (language) params.language = language;
      const res = await api.getTeachers(params);
      setTeachers(res.data);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [subject, country, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  const clearFilters = () => {
    setSearch("");
    setSubject("");
    setCountry("");
    setLanguage("");
  };

  const hasActiveFilters = subject || country || language;

  return (
    <div className="h-screen overflow-y-auto scrollbar-none bg-background">
      <Navbar />

      {/* Top Filter Bar */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <FilterDropdown label="I want to learn" value={subject} options={SUBJECT_OPTIONS} onChange={setSubject} placeholder="Any subject" />
            <FilterDropdown label="Country of birth" value={country} options={COUNTRY_OPTIONS} onChange={setCountry} placeholder="Any country" />
            <FilterDropdown label="Also speaks" value={language} options={LANGUAGE_OPTIONS} onChange={setLanguage} placeholder="Any language" />

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}

            {/* Search on right */}
            <form onSubmit={handleSearch} className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or keyword"
                  className="pl-9 h-9 w-48 sm:w-64 rounded-full text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchTeachers()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Results heading */}
        <h2 className="text-xl font-bold text-foreground mb-6">
          {loading ? (
            "Searching for tutors..."
          ) : (
            <>
              <span className="text-2xl">{teachers.length}</span>{" "}
              {subject || ""}  teacher{teachers.length !== 1 ? "s" : ""} that match your needs
            </>
          )}
        </h2>

        {/* Teacher list */}
        <div className="space-y-4">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 sm:p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-40 h-44 sm:h-48 rounded-xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-32 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                    <div className="h-3 w-48 rounded bg-muted" />
                    <div className="h-3 w-64 rounded bg-muted" />
                    <div className="h-16 w-full rounded bg-muted" />
                  </div>
                  <div className="w-28 space-y-3">
                    <div className="h-6 w-16 rounded bg-muted" />
                    <div className="h-3 w-20 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))
          ) : teachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-5 mb-5">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No tutors found</h3>
              <p className="mt-2 text-muted-foreground max-w-sm">
                Try adjusting your filters or search to find the perfect tutor
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Photo / Avatar */}
                  <div className="w-full sm:w-40 h-48 sm:h-52 rounded-xl overflow-hidden shrink-0 relative">
                    {teacher.avatar ? (
                      <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <AvatarPlaceholder name={teacher.name} />
                    )}
                    {/* Online indicator */}
                    <div className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name + Country */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={getProfilePath(teacher._id)}>
                        <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                          {teacher.name}
                        </h3>
                      </Link>
                      {teacher.country && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" /> {teacher.country}
                        </span>
                      )}
                    </div>

                    {/* Subjects */}
                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 shrink-0" />
                        <span>{teacher.subjects.join(", ")}</span>
                      </div>
                    )}

                    {/* Languages */}
                    {teacher.languages && teacher.languages.length > 0 && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
                        <Languages className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>
                          Speaks {teacher.languages.slice(0, 3).join(", ")}
                          {teacher.languages.length > 3 && (
                            <span className="ml-1 text-xs text-muted-foreground/70">+{teacher.languages.length - 3}</span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-5 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-foreground">{teacher.subscriberCount}</span>
                        <span className="text-muted-foreground">students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-foreground">{teacher.classCount}</span>
                        <span className="text-muted-foreground">lessons</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {teacher.bio && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {teacher.bio}
                      </p>
                    )}

                    {/* Learn more link */}
                    <Link to={getProfilePath(teacher._id)} className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
                      Learn more
                    </Link>
                  </div>

                  {/* Right side: Price + CTA */}
                  <div className="sm:w-44 shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-0 sm:text-right border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                    {/* Wishlist */}
                    <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors ml-auto mb-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Price */}
                    {teacher.hourlyRate > 0 ? (
                      <div className="sm:mb-1">
                        <div className="text-2xl font-bold text-foreground">${teacher.hourlyRate}</div>
                        <div className="text-xs text-muted-foreground">50-min lesson</div>
                      </div>
                    ) : (
                      <div className="sm:mb-1">
                        <div className="text-lg font-semibold text-emerald-600">Free</div>
                        <div className="text-xs text-muted-foreground">trial lesson</div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2 w-full sm:mt-auto">
                      <Link to={getProfilePath(teacher._id)} className="w-full">
                        <Button className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-10 font-semibold text-sm">
                          Book trial lesson
                        </Button>
                      </Link>
                      <Link to={getProfilePath(teacher._id)} className="w-full">
                        <Button variant="outline" className="w-full rounded-xl h-10 text-sm">
                          View profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
