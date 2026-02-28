const router = require("express").Router();
const {
  getStats,
  getAllTeachers,
  getAllStudents,
  getAllClasses,
  toggleUserActive,
  deleteUser,
  getReports,
  createUser,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth");

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/teachers", getAllTeachers);
router.get("/students", getAllStudents);
router.get("/classes", getAllClasses);
router.get("/reports", getReports);
router.post("/users", createUser);
router.put("/users/:id/toggle-active", toggleUserActive);
router.delete("/users/:id", deleteUser);

module.exports = router;
