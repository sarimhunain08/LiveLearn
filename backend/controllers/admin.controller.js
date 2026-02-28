const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Class = require("../models/Class");

// Escape special regex chars to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Create a user (teacher or student) by admin
// @route   POST /api/admin/users
// @access  Private (Admin)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, country, languages, subjects, bio, hourlyRate } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, password and role are required" });
    }

    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be teacher or student" });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    let user;
    if (role === "teacher") {
      const data = { name, email, password };
      if (country) data.country = country;
      if (languages && languages.length) data.languages = languages;
      if (subjects && subjects.length) data.subjects = subjects;
      if (bio) data.bio = bio;
      if (hourlyRate) data.hourlyRate = hourlyRate;
      user = await Teacher.create(data);
    } else {
      user = await Student.create({ name, email, password });
    }

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalClasses = await Class.countDocuments();
    const liveNow = await Class.countDocuments({ status: "live" });
    const completedClasses = await Class.countDocuments({ status: "completed" });

    res.json({
      success: true,
      data: {
        totalTeachers,
        totalStudents,
        totalClasses,
        liveNow,
        completedClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private (Admin)
exports.getAllTeachers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const query = {};

    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { name: { $regex: safe, $options: "i" } },
        { email: { $regex: safe, $options: "i" } },
      ];
    }

    const total = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit);

    // Get class count for each teacher
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const classCount = await Class.countDocuments({ teacher: teacher._id });
        const studentCount = await Class.distinct("enrolledStudents", {
          teacher: teacher._id,
        });
        return {
          ...teacher.toObject(),
          classCount,
          studentCount: studentCount.length,
        };
      })
    );

    res.json({
      success: true,
      count: teachers.length,
      total,
      totalPages: Math.ceil(total / safeLimit),
      data: teachersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const query = {};

    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { name: { $regex: safe, $options: "i" } },
        { email: { $regex: safe, $options: "i" } },
      ];
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit);

    // Get enrolled class count for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const enrolledCount = await Class.countDocuments({
          enrolledStudents: student._id,
        });
        return { ...student.toObject(), enrolledCount };
      })
    );

    res.json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / safeLimit),
      data: studentsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all classes (admin view)
// @route   GET /api/admin/classes
// @access  Private (Admin)
exports.getAllClasses = async (req, res, next) => {
  try {
    const { search, subject, status, page = 1, limit = 20 } = req.query;
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const query = {};

    if (subject && subject !== "all") query.subject = subject;
    if (status && status !== "all") query.status = status;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }

    const total = await Class.countDocuments(query);
    const classes = await Class.find(query)
      .populate("teacher", "name email")
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit);

    res.json({
      success: true,
      count: classes.length,
      total,
      totalPages: Math.ceil(total / safeLimit),
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (Admin)
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Don't allow deleting admins
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot delete admin users" });
    }

    // Cascade cleanup: remove orphaned data
    if (user.role === "teacher") {
      // Cancel all scheduled/live classes by this teacher
      await Class.updateMany(
        { teacher: user._id, status: { $in: ["scheduled", "live"] } },
        { status: "cancelled" }
      );
      // Remove from students' subscribedTeachers
      await Student.updateMany(
        { subscribedTeachers: user._id },
        { $pull: { subscribedTeachers: user._id } }
      );
    } else if (user.role === "student") {
      // Remove from class enrollments
      await Class.updateMany(
        { enrolledStudents: user._id },
        { $pull: { enrolledStudents: user._id, attendedStudents: user._id } }
      );
      // Remove from teachers' subscribers
      await Teacher.updateMany(
        { subscribers: user._id },
        { $pull: { subscribers: user._id } }
      );
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports data
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    // User growth - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newClasses = await Class.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Subject distribution
    const subjectStats = await Class.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Status distribution
    const statusStats = await Class.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        newUsersThisWeek: newUsers,
        newClassesThisWeek: newClasses,
        subjectDistribution: subjectStats,
        statusDistribution: statusStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
