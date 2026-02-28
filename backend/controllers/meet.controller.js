const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const Class = require("../models/Class");

// Load the JaaS private key
let privateKey;
try {
  const keyPath = path.resolve(__dirname, "..", process.env.JAAS_PRIVATE_KEY_PATH || "./jaas.pk");
  privateKey = fs.readFileSync(keyPath, "utf8");
} catch (err) {
  console.error("⚠️  JaaS private key not found. Meeting tokens will not work.");
}

// @desc    Generate a JaaS JWT token for Jitsi meeting
// @route   POST /api/meet/token
// @access  Private (Teacher or Student)
exports.getJitsiToken = async (req, res, next) => {
  try {
    if (!privateKey) {
      return res.status(500).json({
        success: false,
        message: "JaaS private key is not configured on the server.",
      });
    }

    const { roomName } = req.body;
    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "roomName is required.",
      });
    }

    // Validate that the roomName maps to a real class the user has access to
    const cls = await Class.findById(roomName.replace(/^class-/, ""));
    if (cls) {
      const userId = req.user.id;
      const isTeacher = cls.teacher.toString() === userId;
      const isEnrolled = cls.enrolledStudents.some((s) => s.toString() === userId);
      const isAdmin = req.user.role === "admin";
      if (!isTeacher && !isEnrolled && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to join this meeting.",
        });
      }
    }

    const appId = process.env.JAAS_APP_ID;
    const keyId = process.env.JAAS_KEY_ID;
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;
    const isTeacher = req.user.role === "teacher";

    // JaaS JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      aud: "jitsi",
      iss: "chat",
      sub: appId,
      room: roomName,
      exp: now + 3 * 60 * 60, // 3 hours
      nbf: now - 10,
      context: {
        user: {
          id: userId,
          name: userName,
          email: userEmail,
          avatar: "",
          moderator: isTeacher,
        },
        features: {
          livestreaming: isTeacher,
          recording: isTeacher,
          transcription: false,
          "outbound-call": false,
          "sip-outbound-call": false,
        },
      },
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      header: {
        kid: keyId,
        typ: "JWT",
        alg: "RS256",
      },
    });

    res.json({
      success: true,
      data: { token, roomName },
    });
  } catch (error) {
    next(error);
  }
};
