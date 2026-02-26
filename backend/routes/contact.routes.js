const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contact.controller");

// Public
router.post("/", submitContact);

// Admin only
router.get("/", protect, authorize("admin"), getContacts);
router.get("/:id", protect, authorize("admin"), getContact);
router.put("/:id", protect, authorize("admin"), updateContact);
router.delete("/:id", protect, authorize("admin"), deleteContact);

module.exports = router;
