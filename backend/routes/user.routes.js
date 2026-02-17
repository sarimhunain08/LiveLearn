const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  getTeachers,
  getTeacherProfile,
  subscribeToTeacher,
  unsubscribeFromTeacher,
  getSubscribedTeachers,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");

router.get("/teachers", getTeachers);
router.get("/teachers/:id", getTeacherProfile);
router.post("/teachers/:id/subscribe", protect, authorize("student"), subscribeToTeacher);
router.post("/teachers/:id/unsubscribe", protect, authorize("student"), unsubscribeFromTeacher);
router.get("/subscribed-teachers", protect, authorize("student"), getSubscribedTeachers);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
