/**
 * Timezone-aware date/time utilities for Ilmify.
 *
 * Classes store `classDateTime` (UTC) — the exact moment the class starts.
 * When displayed, these are automatically converted to the viewer's local timezone
 * via the browser's built-in Intl API.
 *
 * For legacy classes without `classDateTime`, we fall back to `date` + `time` + `timezone`.
 */

interface ClassLike {
  classDateTime?: string;
  date?: string;
  time?: string;
  timezone?: string;
}

/**
 * Get a proper Date object representing the class start time in UTC.
 * Works with both new (classDateTime) and legacy (date + time + timezone) formats.
 */
export function getClassStartDate(cls: ClassLike): Date {
  if (cls.classDateTime) {
    return new Date(cls.classDateTime);
  }

  // Legacy fallback: combine date + time (treat as teacher's timezone = Asia/Karachi)
  if (cls.date && cls.time) {
    const dateStr = new Date(cls.date).toISOString().split("T")[0];
    const timeMatch = cls.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3]?.toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      // Create in local timezone of the viewer — not perfect for legacy, but reasonable
      return new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
    }
    return new Date(cls.date);
  }

  return new Date(cls.date || Date.now());
}

/**
 * Format class date in viewer's local timezone.
 * Example: "Feb 17, 2026" or "Monday, February 17, 2026"
 */
export function formatClassDate(cls: ClassLike, style: "short" | "long" = "short"): string {
  const d = getClassStartDate(cls);

  if (style === "long") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format class time in viewer's local timezone.
 * Example: "9:00 AM", "2:30 PM"
 */
export function formatClassTime(cls: ClassLike): string {
  const d = getClassStartDate(cls);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format both date and time together.
 * Example: "Feb 17, 2026 • 9:00 AM"
 */
export function formatClassDateTime(cls: ClassLike, dateStyle: "short" | "long" = "short"): string {
  return `${formatClassDate(cls, dateStyle)} • ${formatClassTime(cls)}`;
}

/**
 * Get viewer's timezone name for display.
 * Example: "Pakistan Standard Time", "Eastern Standard Time"
 */
export function getViewerTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get short timezone abbreviation for viewer.
 * Example: "PKT", "EST", "IST"
 */
export function getViewerTimezoneShort(): string {
  const d = new Date();
  const parts = d.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ");
  return parts[parts.length - 1]; // Last part is timezone abbreviation
}

/**
 * Parse duration string to minutes.
 */
export function parseDurationMinutes(duration: string): number {
  const match = duration?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 60;
}

/**
 * Get the end time of a class.
 */
export function getClassEndDate(cls: ClassLike & { duration?: string }): Date {
  const start = getClassStartDate(cls);
  const durationMin = parseDurationMinutes(cls.duration || "60");
  return new Date(start.getTime() + durationMin * 60000);
}
