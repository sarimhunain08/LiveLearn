const mongoose = require("mongoose");
const User = require("./User");

// Teacher discriminator — inherits all User fields
// Teacher.find() only returns docs with role === "teacher"
const teacherSchema = new mongoose.Schema({});

const Teacher = User.discriminator("teacher", teacherSchema);

module.exports = Teacher;
