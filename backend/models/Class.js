const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Class title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      enum: ["math", "science", "english", "history", "art", "music", "programming", "arabic"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Class date is required"],
    },
    time: {
      type: String,
      required: [true, "Class time is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      enum: ["30 min", "45 min", "60 min", "90 min", "120 min"],
    },
    maxStudents: {
      type: Number,
      default: 50,
      min: 1,
      max: 500,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    meetingLink: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    timezone: {
      type: String,
      default: "Asia/Karachi",
    },
    classDateTime: {
      type: Date,
    },
    teacherJoined: {
      type: Boolean,
      default: false,
    },
    liveAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    attendedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    settings: {
      chat: { type: Boolean, default: true },
      screenShare: { type: Boolean, default: true },
      recording: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for frequently queried fields
classSchema.index({ teacher: 1 });
classSchema.index({ status: 1 });
classSchema.index({ enrolledStudents: 1 });
classSchema.index({ subject: 1, status: 1 });

// Pre-save: always compute classDateTime from date + time + timezone
classSchema.pre("save", async function () {
  if ((this.isModified("date") || this.isModified("time") || this.isModified("timezone") || !this.classDateTime) && this.date && this.time) {
    this.classDateTime = computeClassStartUTC(this.date, this.time, this.timezone || "Asia/Karachi");
  }
});

// Virtual for enrolled count
classSchema.virtual("enrolledCount").get(function () {
  return (this.enrolledStudents || []).length;
});

// Virtual for spots left
classSchema.virtual("spotsLeft").get(function () {
  return this.maxStudents - (this.enrolledStudents || []).length;
});

// Static: auto-update statuses in bulk (scheduled→live, live→completed, scheduled→cancelled)
classSchema.statics.autoUpdateStatuses = async function () {
  const now = new Date();
  // Use lean() to avoid virtual getter issues
  const classes = await this.find({ status: { $in: ["scheduled", "live"] } }).select("date time duration classDateTime timezone status teacherJoined").lean();
  const toLive = [];
  const toCompleted = [];
  const toCancelled = [];

  for (const cls of classes) {
    let classStart;

    if (cls.classDateTime) {
      classStart = new Date(cls.classDateTime);
    } else {
      classStart = computeClassStartUTC(cls.date, cls.time, cls.timezone);
    }

    const durationMin = parseInt(cls.duration) || 60;
    const classEnd = new Date(classStart.getTime() + durationMin * 60000);

    if (now >= classEnd) {
      if (cls.status === "live" && cls.teacherJoined) {
        // Teacher actually joined and conducted the class → completed
        toCompleted.push(cls._id);
      } else {
        // Teacher never joined (auto-live or scheduled) → cancelled
        toCancelled.push(cls._id);
      }
    } else if (now >= classStart && cls.status === "scheduled") {
      // Class time has arrived but not ended → auto set to live
      toLive.push(cls._id);
    }
  }

  if (toLive.length > 0) {
    await this.updateMany({ _id: { $in: toLive } }, { status: "live", liveAt: now });
  }
  if (toCompleted.length > 0) {
    await this.updateMany({ _id: { $in: toCompleted } }, { status: "completed", completedAt: now });
  }
  if (toCancelled.length > 0) {
    await this.updateMany({ _id: { $in: toCancelled } }, { status: "cancelled" });
  }

  return toLive.length + toCompleted.length + toCancelled.length;
};

// Helper: compute UTC start time from date + time + timezone (for legacy classes)
function computeClassStartUTC(date, time, timezone) {
  const tz = timezone || "Asia/Karachi";
  const d = new Date(date);
  const dateStr = d.toISOString().split("T")[0]; // "2026-02-17"
  const [hours, minutes] = (time || "00:00").split(":").map(Number);
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  // Create a date string and find what UTC offset corresponds to that timezone
  // Using Intl.DateTimeFormat to resolve the offset
  try {
    const localStr = `${dateStr}T${timeStr}:00`;
    // Get timezone offset by comparing formatted time vs UTC
    const testDate = new Date(localStr + "Z"); // Treat as UTC first
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(testDate);
    const get = (type) => parseInt(parts.find(p => p.type === type).value);
    const tzTime = new Date(Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") === 24 ? 0 : get("hour"), get("minute"), get("second")));
    const offsetMs = tzTime.getTime() - testDate.getTime();

    // The actual UTC time = local time - offset
    const localDate = new Date(`${dateStr}T${timeStr}:00Z`);
    return new Date(localDate.getTime() - offsetMs);
  } catch {
    // Fallback: use server local time
    const fallback = new Date(d);
    fallback.setHours(hours, minutes, 0, 0);
    return fallback;
  }
}

module.exports = mongoose.model("Class", classSchema);
