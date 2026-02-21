const mongoose = require("mongoose");
const User = require("./User");

// Student discriminator — inherits all User fields
// Student.find() only returns docs with role === "student"
const studentSchema = new mongoose.Schema({});

const Student = User.discriminator("student", studentSchema);

module.exports = Student;
