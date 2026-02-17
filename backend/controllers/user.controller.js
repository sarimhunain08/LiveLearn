const User = require("../models/User");
const Class = require("../models/Class");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      avatar: req.body.avatar,
      bio: req.body.bio,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teachers (public listing)
// @route   GET /api/users/teachers
// @access  Public
exports.getTeachers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { role: "teacher", isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await User.find(query).select(
      "name email avatar bio createdAt"
    );

    // Get class counts and subscriber counts for each teacher
    const teacherData = await Promise.all(
      teachers.map(async (teacher) => {
        const classCount = await Class.countDocuments({ teacher: teacher._id });
        const subscriberCount = await User.countDocuments({ subscribedTeachers: teacher._id });
        return {
          ...teacher.toObject(),
          classCount,
          subscriberCount,
        };
      })
    );

    res.json({ success: true, count: teacherData.length, data: teacherData });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single teacher profile with their classes
// @route   GET /api/users/teachers/:id
// @access  Public
exports.getTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id).select(
      "name email avatar bio createdAt"
    );

    if (!teacher || teacher.role !== undefined) {
      // Verify it's actually a teacher
      const checkUser = await User.findById(req.params.id);
      if (!checkUser || checkUser.role !== "teacher") {
        return res.status(404).json({ success: false, message: "Teacher not found" });
      }
    }

    const classes = await Class.find({ teacher: req.params.id })
      .select("title subject date time duration status maxStudents enrolledStudents")
      .sort({ date: 1 });

    const subscriberCount = await User.countDocuments({ subscribedTeachers: req.params.id });

    res.json({
      success: true,
      data: {
        ...teacher.toObject(),
        classes,
        classCount: classes.length,
        subscriberCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe to a teacher
// @route   POST /api/users/teachers/:id/subscribe
// @access  Private (Student)
exports.subscribeToTeacher = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const student = await User.findById(req.user.id);

    if (student.subscribedTeachers.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: "Already subscribed to this teacher" });
    }

    student.subscribedTeachers.push(req.params.id);
    await student.save();

    res.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from a teacher
// @route   POST /api/users/teachers/:id/unsubscribe
// @access  Private (Student)
exports.unsubscribeFromTeacher = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id);

    if (!student.subscribedTeachers.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: "Not subscribed to this teacher" });
    }

    student.subscribedTeachers = student.subscribedTeachers.filter(
      (id) => id.toString() !== req.params.id
    );
    await student.save();

    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my subscribed teachers
// @route   GET /api/users/subscribed-teachers
// @access  Private (Student)
exports.getSubscribedTeachers = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id).populate(
      "subscribedTeachers",
      "name email avatar bio"
    );

    res.json({ success: true, data: student.subscribedTeachers });
  } catch (error) {
    next(error);
  }
};
