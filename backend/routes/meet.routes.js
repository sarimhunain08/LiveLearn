const router = require("express").Router();
const { getJitsiToken } = require("../controllers/meet.controller");
const { protect } = require("../middleware/auth");

// Generate JaaS JWT token (any authenticated user - teacher or student)
router.post("/token", protect, getJitsiToken);

module.exports = router;
