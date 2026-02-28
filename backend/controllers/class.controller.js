const Class = require("../models/Class");
const User = require("../models/User");

// Escape special regex chars to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whitelist of fields a teacher can set/update on a class
const ALLOWED_CLASS_FIELDS = [
  "title",
  "description",
  "subject",
  "date",
  "time",
  "duration",
  "maxStudents",
  "timezone",
];

// Helper: pick only allowed keys from an object
const pick = (obj, keys) => {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Teacher)
exports.createClass = async (req, res, next) => {
  try {
    // Only pick fields a teacher is allowed to set (prevents mass assignment)
    const allowed = pick(req.body, ALLOWED_CLASS_FIELDS);
    allowed.teacher = req.user.id;

    // Ensure timezone is set — pre-save hook will compute classDateTime automatically
    if (!allowed.timezone) {
      allowed.timezone = "Asia/Karachi";
    }

    const newClass = await Class.create(allowed);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all classes (browse) with filters
// @route   GET /api/classes
// @access  Public
exports.getClasses = async (req, res, next) => {
  try {
    const { subject, search, status, page = 1, limit = 12 } = req.query;
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 12));
    const query = {};

    if (subject && subject !== "all") query.subject = subject;
    if (status) query.status = status;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }

    const total = await Class.countDocuments(query);
    const classes = await Class.find(query)
      .populate("teacher", "name email avatar")
      .sort({ date: 1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit);

    res.json({
      success: true,
      count: classes.length,
      total,
      totalPages: Math.ceil(total / safeLimit),
      currentPage: safePage,
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate("teacher", "name email avatar")
      .populate("enrolledStudents", "name email avatar");

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private (Teacher - owner)
exports.updateClass = async (req, res, next) => {
  try {
    let cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Make sure user is the class teacher
    if (cls.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this class" });
    }

    // Only pick fields a teacher is allowed to update (prevents mass assignment)
    const allowed = pick(req.body, ALLOWED_CLASS_FIELDS);

    cls = await Class.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private (Teacher - owner / Admin)
exports.deleteClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (cls.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this class" });
    }

    await cls.deleteOne();
    res.json({ success: true, message: "Class deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll student in a class
// @route   POST /api/classes/:id/enroll
// @access  Private (Student)
exports.enrollInClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Check if already enrolled
    if (cls.enrolledStudents.some((id) => id.toString() === req.user.id)) {
      return res.status(400).json({ success: false, message: "Already enrolled in this class" });
    }

    // Check if class is full
    if (cls.enrolledStudents.length >= cls.maxStudents) {
      return res.status(400).json({ success: false, message: "Class is full" });
    }

    cls.enrolledStudents.push(req.user.id);
    await cls.save();

    res.json({ success: true, message: "Enrolled successfully", data: cls });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll student from a class
// @route   POST /api/classes/:id/unenroll
// @access  Private (Student)
exports.unenrollFromClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (!cls.enrolledStudents.some((id) => id.toString() === req.user.id)) {
      return res.status(400).json({ success: false, message: "Not enrolled in this class" });
    }

    cls.enrolledStudents = cls.enrolledStudents.filter(
      (id) => id.toString() !== req.user.id
    );
    await cls.save();

    res.json({ success: true, message: "Unenrolled successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get classes for logged-in teacher
// @route   GET /api/classes/my-classes
// @access  Private (Teacher)
exports.getMyClasses = async (req, res, next) => {
  try {
    // Auto-update stale statuses before returning
    await Class.autoUpdateStatuses();

    const classes = await Class.find({ teacher: req.user.id })
      .populate("enrolledStudents", "name email avatar")
      .sort({ date: 1 });

    res.json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrolled classes for logged-in student
// @route   GET /api/classes/enrolled
// @access  Private (Student)
exports.getEnrolledClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ enrolledStudents: req.user.id })
      .populate("teacher", "name email avatar")
      .sort({ date: 1 });

    res.json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get students for a teacher's class
// @route   GET /api/classes/:id/students
// @access  Private (Teacher - owner)
exports.getClassStudents = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id).populate(
      "enrolledStudents",
      "name email avatar createdAt"
    );

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (cls.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, count: cls.enrolledStudents.length, data: cls.enrolledStudents });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's all students (enrolled + subscribed)
// @route   GET /api/classes/my-students
// @access  Private (Teacher)
exports.getMyStudents = async (req, res, next) => {
  try {
    const classes = await Class.find({ teacher: req.user.id }).populate(
      "enrolledStudents",
      "name email avatar createdAt"
    );

    // Get unique students across all classes
    const studentMap = new Map();
    classes.forEach((cls) => {
      cls.enrolledStudents.forEach((student) => {
        if (!studentMap.has(student._id.toString())) {
          studentMap.set(student._id.toString(), {
            ...student.toObject(),
            enrolledClasses: 1,
            type: "enrolled",
          });
        } else {
          studentMap.get(student._id.toString()).enrolledClasses += 1;
        }
      });
    });

    // Also get students who subscribed to this teacher (from teacher's subscribers field)
    const teacher = await User.findById(req.user.id).populate(
      "subscribers",
      "name email avatar createdAt"
    );
    const subscribers = teacher?.subscribers || [];

    subscribers.forEach((sub) => {
      if (!studentMap.has(sub._id.toString())) {
        studentMap.set(sub._id.toString(), {
          ...sub.toObject(),
          enrolledClasses: 0,
          type: "subscriber",
        });
      } else {
        // Student is both enrolled and subscribed
        studentMap.get(sub._id.toString()).type = "enrolled";
      }
    });

    const students = Array.from(studentMap.values());
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats for teacher
// @route   GET /api/classes/teacher-stats
// @access  Private (Teacher)
exports.getTeacherStats = async (req, res, next) => {
  try {
    // Auto-update stale statuses before computing stats
    await Class.autoUpdateStatuses();

    const classes = await Class.find({ teacher: req.user.id });

    const totalStudents = new Set();
    let completedClasses = 0;
    let upcomingClasses = 0;
    let teachingMinutes = 0;

    classes.forEach((cls) => {
      cls.enrolledStudents.forEach((id) => totalStudents.add(id.toString()));
      if (cls.status === "completed") {
        completedClasses++;
        // Use actual teaching time (liveAt→completedAt) if available, else fall back to scheduled duration
        if (cls.liveAt && cls.completedAt) {
          const actualMin = Math.round((new Date(cls.completedAt) - new Date(cls.liveAt)) / 60000);
          teachingMinutes += Math.max(actualMin, 0);
        } else {
          const dur = parseInt(cls.duration) || 0;
          teachingMinutes += dur;
        }
      }
      if (cls.status === "scheduled" || cls.status === "live") upcomingClasses++;
    });

    res.json({
      success: true,
      data: {
        totalStudents: totalStudents.size,
        totalClasses: classes.length,
        completedClasses,
        upcomingClasses,
        teachingMinutes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats for student
// @route   GET /api/classes/student-stats
// @access  Private (Student)
exports.getStudentStats = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id);
    const teacherIds = student.subscribedTeachers || [];

    const classes = await Class.find({ teacher: { $in: teacherIds } });

    let upcomingClasses = 0;
    let completedClasses = 0;
    let attendedClasses = 0;

    classes.forEach((cls) => {
      if (cls.status === "completed") completedClasses++;
      if (cls.status === "scheduled" || cls.status === "live") upcomingClasses++;
      if (cls.attendedStudents?.some((id) => id.toString() === req.user.id)) attendedClasses++;
    });

    res.json({
      success: true,
      data: {
        subscribedTeachers: teacherIds.length,
        totalClasses: classes.length,
        upcomingClasses,
        completedClasses,
        attendedClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all classes from subscribed teachers
// @route   GET /api/classes/student/subscribed
// @access  Private (Student)
exports.getSubscribedClasses = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id);
    const teacherIds = student.subscribedTeachers || [];

    // Auto-update stale statuses before returning
    await Class.autoUpdateStatuses();

    const classes = await Class.find({ teacher: { $in: teacherIds } })
      .populate("teacher", "name email avatar")
      .sort({ date: 1 });

    res.json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Start a class (set status to live)
// @route   PUT /api/classes/:id/start
// @access  Private (Teacher - owner)
exports.startClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (cls.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (cls.status !== "scheduled" && cls.status !== "live") {
      return res.status(400).json({ success: false, message: `Cannot start a class with status '${cls.status}'` });
    }

    cls.status = "live";
    cls.teacherJoined = true;
    cls.liveAt = new Date();
    await cls.save();

    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

// @desc    End a class (set status to completed)
// @route   PUT /api/classes/:id/end
// @access  Private (Teacher - owner)
exports.endClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (cls.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (cls.status !== "live") {
      return res.status(400).json({ success: false, message: `Cannot end a class with status '${cls.status}'` });
    }

    cls.status = "completed";
    cls.completedAt = new Date();
    await cls.save();

    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark student attendance (when student joins meeting)
// @route   POST /api/classes/:id/attend
// @access  Private (Student)
exports.attendClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Guard: class must be live
    if (cls.status !== "live") {
      return res.status(400).json({ success: false, message: "Class is not currently live" });
    }

    // Guard: student must be enrolled
    if (!cls.enrolledStudents.some((id) => id.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: "You are not enrolled in this class" });
    }

    // Check if already marked
    const alreadyAttended = cls.attendedStudents.some(
      (id) => id.toString() === req.user.id
    );

    if (!alreadyAttended) {
      cls.attendedStudents.push(req.user.id);
      await cls.save();
    }

    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};
