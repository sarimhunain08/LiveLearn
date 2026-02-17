const router = require("express").Router();
const {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
  enrollInClass,
  unenrollFromClass,
  getMyClasses,
  getEnrolledClasses,
  getClassStudents,
  getMyStudents,
  getTeacherStats,
  getStudentStats,
  getSubscribedClasses,
  startClass,
  endClass,
  attendClass,
} = require("../controllers/class.controller");
const { protect, authorize } = require("../middleware/auth");

// Teacher routes (must come before /:id)
router.get("/teacher/my-classes", protect, authorize("teacher"), getMyClasses);
router.get("/teacher/my-students", protect, authorize("teacher"), getMyStudents);
router.get("/teacher/stats", protect, authorize("teacher"), getTeacherStats);

// Student routes (must come before /:id)
router.get("/student/enrolled", protect, authorize("student"), getEnrolledClasses);
router.get("/student/subscribed", protect, authorize("student"), getSubscribedClasses);
router.get("/student/stats", protect, authorize("student"), getStudentStats);

// Public
router.get("/", getClasses);
router.get("/:id", getClass);

// Teacher create
router.post("/", protect, authorize("teacher"), createClass);
router.get("/:id/students", protect, authorize("teacher", "admin"), getClassStudents);

// Student enroll/unenroll
router.post("/:id/enroll", protect, authorize("student"), enrollInClass);
router.post("/:id/unenroll", protect, authorize("student"), unenrollFromClass);
router.post("/:id/attend", protect, authorize("student"), attendClass);

// Teacher start/end class
router.put("/:id/start", protect, authorize("teacher"), startClass);
router.put("/:id/end", protect, authorize("teacher"), endClass);

// Update / Delete (teacher owner or admin)
router.put("/:id", protect, authorize("teacher", "admin"), updateClass);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteClass);

module.exports = router;
