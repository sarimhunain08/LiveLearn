const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Class = require("./models/Class");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Class.deleteMany();
    console.log("Existing data cleared.");

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@demo.com",
      password: "password123",
      role: "admin",
    });

    const teacher1 = await User.create({
      name: "Sarah Johnson",
      email: "teacher@demo.com",
      password: "password123",
      role: "teacher",
    });

    const teacher2 = await User.create({
      name: "Dr. Michael Lee",
      email: "teacher2@demo.com",
      password: "password123",
      role: "teacher",
    });

    const teacher3 = await User.create({
      name: "Prof. Emily Davis",
      email: "teacher3@demo.com",
      password: "password123",
      role: "teacher",
    });

    const student1 = await User.create({
      name: "Alex Chen",
      email: "student@demo.com",
      password: "password123",
      role: "student",
    });

    const student2 = await User.create({
      name: "Maria Garcia",
      email: "student2@demo.com",
      password: "password123",
      role: "student",
    });

    const student3 = await User.create({
      name: "James Wilson",
      email: "student3@demo.com",
      password: "password123",
      role: "student",
    });

    const student4 = await User.create({
      name: "Fatima Noor",
      email: "student4@demo.com",
      password: "password123",
      role: "student",
    });

    console.log("Users created.");

    // Create classes
    await Class.create([
      {
        title: "Algebra Fundamentals",
        description: "Learn the basics of algebra including equations, inequalities, and functions.",
        subject: "math",
        teacher: teacher1._id,
        date: new Date("2026-02-15"),
        time: "10:00 AM",
        duration: "60 min",
        maxStudents: 30,
        enrolledStudents: [student1._id, student2._id, student3._id],
        meetingLink: "https://livelearn.app/class/alg001",
        status: "scheduled",
      },
      {
        title: "Introduction to Physics",
        description: "Explore the fundamental concepts of physics: motion, force, and energy.",
        subject: "science",
        teacher: teacher2._id,
        date: new Date("2026-02-15"),
        time: "2:00 PM",
        duration: "45 min",
        maxStudents: 25,
        enrolledStudents: [student1._id, student4._id],
        meetingLink: "https://livelearn.app/class/phy001",
        status: "scheduled",
      },
      {
        title: "English Literature Review",
        description: "Dive into classic and modern English literature texts.",
        subject: "english",
        teacher: teacher3._id,
        date: new Date("2026-02-16"),
        time: "11:00 AM",
        duration: "90 min",
        maxStudents: 30,
        enrolledStudents: [student1._id, student2._id, student3._id, student4._id],
        status: "live",
      },
      {
        title: "World History: Modern Era",
        description: "Study major events from the 18th century to the present day.",
        subject: "history",
        teacher: teacher1._id,
        date: new Date("2026-02-17"),
        time: "9:00 AM",
        duration: "60 min",
        maxStudents: 40,
        enrolledStudents: [student2._id, student3._id],
        status: "scheduled",
      },
      {
        title: "Advanced Calculus",
        description: "Take your math skills to the next level with calculus concepts.",
        subject: "math",
        teacher: teacher2._id,
        date: new Date("2026-02-18"),
        time: "10:00 AM",
        duration: "60 min",
        maxStudents: 25,
        enrolledStudents: [],
        status: "scheduled",
      },
      {
        title: "Organic Chemistry",
        description: "Explore the structures, properties, and reactions of organic compounds.",
        subject: "science",
        teacher: teacher3._id,
        date: new Date("2026-02-19"),
        time: "1:00 PM",
        duration: "90 min",
        maxStudents: 20,
        enrolledStudents: [student4._id],
        status: "scheduled",
      },
      {
        title: "Intro to Python Programming",
        description: "Learn Python from scratch – variables, loops, functions, and more.",
        subject: "programming",
        teacher: teacher1._id,
        date: new Date("2026-02-20"),
        time: "3:00 PM",
        duration: "120 min",
        maxStudents: 50,
        enrolledStudents: [student1._id, student2._id],
        status: "scheduled",
      },
      {
        title: "Digital Art Basics",
        description: "Get started with digital art tools and techniques.",
        subject: "art",
        teacher: teacher2._id,
        date: new Date("2026-02-10"),
        time: "2:00 PM",
        duration: "90 min",
        maxStudents: 15,
        enrolledStudents: [student3._id, student4._id],
        status: "completed",
      },
    ]);

    console.log("Classes created.");
    console.log("\n--- Seed Complete ---");
    console.log("Demo Accounts:");
    console.log("  Admin:   admin@demo.com   / password123");
    console.log("  Teacher: teacher@demo.com / password123");
    console.log("  Student: student@demo.com / password123");
    console.log("--------------------\n");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
