const router = require("express").Router();
const { signup, login, getMe, logout, updatePassword } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/update-password", protect, updatePassword);

module.exports = router;
