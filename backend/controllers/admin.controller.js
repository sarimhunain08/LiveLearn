const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Class = require("../models/Class");

// Escape special regex chars to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
      .skip((page - 1) * limit)
      .limit(Number(limit));

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
      totalPages: Math.ceil(total / limit),
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
      .skip((page - 1) * limit)
      .limit(Number(limit));

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
      totalPages: Math.ceil(total / limit),
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
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: classes.length,
      total,
      totalPages: Math.ceil(total / limit),
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
