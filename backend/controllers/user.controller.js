const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
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
      country: req.body.country,
      languages: req.body.languages,
      subjects: req.body.subjects,
      hourlyRate: req.body.hourlyRate,
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
    const { search, subject, country, language } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { subjects: { $regex: search, $options: "i" } },
      ];
    }

    if (subject) {
      query.subjects = { $regex: subject, $options: "i" };
    }
    if (country) {
      query.country = { $regex: country, $options: "i" };
    }
    if (language) {
      query.languages = { $regex: language, $options: "i" };
    }

    const teachers = await Teacher.find(query).select(
      "name avatar bio country languages subjects hourlyRate createdAt subscribers"
    );

    // Get class counts and subscriber counts for each teacher
    const teacherData = await Promise.all(
      teachers.map(async (teacher) => {
        const classCount = await Class.countDocuments({ teacher: teacher._id });
        const subscriberCount = teacher.subscribers?.length || 0;
        return {
          ...teacher.toObject(),
          classCount,
          subscriberCount,
          subscribers: undefined, // don't send full array to client
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
    const teacher = await Teacher.findById(req.params.id).select(
      "name avatar bio country languages subjects hourlyRate createdAt subscribers"
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const classes = await Class.find({ teacher: req.params.id })
      .select("title subject date time duration status maxStudents enrolledStudents")
      .sort({ date: 1 });

    const subscriberCount = teacher.subscribers?.length || 0;

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
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const student = await Student.findById(req.user.id);

    // Check if already subscribed (check both sides)
    if (student.subscribedTeachers.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: "Already subscribed to this teacher" });
    }

    // Add teacher to student's subscribedTeachers
    student.subscribedTeachers.push(req.params.id);
    await student.save();

    // Add student to teacher's subscribers
    if (!teacher.subscribers.includes(req.user.id)) {
      teacher.subscribers.push(req.user.id);
      await teacher.save();
    }

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
    const student = await Student.findById(req.user.id);

    if (!student.subscribedTeachers.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: "Not subscribed to this teacher" });
    }

    // Remove teacher from student's subscribedTeachers
    student.subscribedTeachers = student.subscribedTeachers.filter(
      (id) => id.toString() !== req.params.id
    );
    await student.save();

    // Remove student from teacher's subscribers
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      teacher.subscribers = teacher.subscribers.filter(
        (id) => id.toString() !== req.user.id
      );
      await teacher.save();
    }

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
    const student = await Student.findById(req.user.id).populate(
      "subscribedTeachers",
      "name avatar bio country languages subjects hourlyRate subscribers"
    );

    res.json({ success: true, data: student.subscribedTeachers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscribed teachers with their classes
// @route   GET /api/users/subscribed-teachers/details
// @access  Private (Student)
exports.getSubscribedTeachersWithClasses = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id).populate(
      "subscribedTeachers",
      "name avatar bio country languages subjects hourlyRate subscribers"
    );

    const teachersWithClasses = await Promise.all(
      (student.subscribedTeachers || []).map(async (teacher) => {
        const classes = await Class.find({ teacher: teacher._id })
          .select("title subject date time duration status maxStudents enrolledStudents")
          .sort({ date: -1 });

        const now = new Date();
        const upcoming = classes.filter(c => c.status === "scheduled" || c.status === "live");
        const completed = classes.filter(c => c.status === "completed");
        const previous = classes.filter(c => c.status === "cancelled");

        return {
          ...teacher.toObject(),
          subscriberCount: teacher.subscribers?.length || 0,
          classCount: classes.length,
          classes: { upcoming, completed, previous },
        };
      })
    );

    res.json({ success: true, data: teachersWithClasses });
  } catch (error) {
    next(error);
  }
};
