const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Admin = require("./models/Admin");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");
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

    // Create admin
    const admin = await Admin.create({
      name: "Admin User",
      email: "admin@demo.com",
      password: "password123",
    });

    // --- TEACHERS (with full profile data) ---
    const teacher1 = await Teacher.create({
      name: "Sarah Johnson",
      email: "teacher@demo.com",
      password: "password123",
      country: "United States",
      languages: ["English (Native)", "Spanish (Intermediate)"],
      subjects: ["Mathematics", "Statistics"],
      bio: "Experienced math teacher with 8+ years in online education. I specialize in making complex concepts simple and enjoyable. My students consistently improve their grades and develop a genuine love for mathematics.",
      hourlyRate: 25,
    });

    const teacher2 = await Teacher.create({
      name: "Dr. Michael Lee",
      email: "teacher2@demo.com",
      password: "password123",
      country: "United Kingdom",
      languages: ["English (Native)", "Mandarin (Fluent)"],
      subjects: ["Physics", "Chemistry"],
      bio: "PhD in Theoretical Physics from Cambridge. 12 years of teaching experience at university level. I bring real-world examples into every lesson to make science come alive for my students.",
      hourlyRate: 35,
    });

    const teacher3 = await Teacher.create({
      name: "Prof. Emily Davis",
      email: "teacher3@demo.com",
      password: "password123",
      country: "Canada",
      languages: ["English (Native)", "French (Fluent)"],
      subjects: ["English Literature", "English Language"],
      bio: "Published author and literature professor with a passion for storytelling. I help students develop critical thinking through close reading and creative writing exercises.",
      hourlyRate: 30,
    });

    const teacher4 = await Teacher.create({
      name: "Ahmed Hassan",
      email: "teacher4@demo.com",
      password: "password123",
      country: "Pakistan",
      languages: ["Urdu (Native)", "English (Fluent)", "Arabic (Advanced)"],
      subjects: ["Islamiat", "Urdu", "Pakistan Studies"],
      bio: "Dedicated educator with 10 years of experience teaching Islamic studies, Urdu, and Pakistan Studies. Passionate about helping students connect with their heritage while excelling academically.",
      hourlyRate: 15,
    });

    const teacher5 = await Teacher.create({
      name: "Yuki Tanaka",
      email: "teacher5@demo.com",
      password: "password123",
      country: "Japan",
      languages: ["Japanese (Native)", "English (Fluent)"],
      subjects: ["Japanese", "Computer Science", "Programming"],
      bio: "Software engineer turned educator. I teach Japanese language and programming with a unique bilingual approach. Former developer at Sony with 6 years of teaching experience.",
      hourlyRate: 28,
    });

    const teacher6 = await Teacher.create({
      name: "Maria Fernandez",
      email: "teacher6@demo.com",
      password: "password123",
      country: "Spain",
      languages: ["Spanish (Native)", "English (Fluent)", "Portuguese (Intermediate)"],
      subjects: ["Spanish", "French", "Geography"],
      bio: "Polyglot language teacher specializing in immersive learning methods. I make language learning fun through conversation, culture, and real-world scenarios. 7+ years online teaching.",
      hourlyRate: 22,
    });

    const teacher7 = await Teacher.create({
      name: "David Okafor",
      email: "teacher7@demo.com",
      password: "password123",
      country: "Nigeria",
      languages: ["English (Native)", "Yoruba (Native)"],
      subjects: ["Economics", "Accounting", "Business Studies"],
      bio: "Chartered accountant and economics tutor. I bring practical business knowledge into every lesson. My students go on to excel in A-levels, university entrance exams, and beyond.",
      hourlyRate: 18,
    });

    const teacher8 = await Teacher.create({
      name: "Fatima Al-Rashid",
      email: "teacher8@demo.com",
      password: "password123",
      country: "United Arab Emirates",
      languages: ["Arabic (Native)", "English (Fluent)", "French (Intermediate)"],
      subjects: ["Arabic", "Islamiat", "History"],
      bio: "Experienced Arabic and Islamic Studies instructor with a Master's in Education. I create engaging, structured lessons that help students of all ages and backgrounds learn effectively.",
      hourlyRate: 20,
    });

    const teacher9 = await Teacher.create({
      name: "Hans Müller",
      email: "teacher9@demo.com",
      password: "password123",
      country: "Germany",
      languages: ["German (Native)", "English (Fluent)"],
      subjects: ["German", "Engineering", "Mathematics"],
      bio: "Mechanical engineering graduate from TU Munich. I teach German language and STEM subjects with a focus on problem-solving and analytical thinking. Known for my patient teaching style.",
      hourlyRate: 30,
    });

    const teacher10 = await Teacher.create({
      name: "Priya Sharma",
      email: "teacher10@demo.com",
      password: "password123",
      country: "India",
      languages: ["Hindi (Native)", "English (Fluent)", "Sanskrit (Advanced)"],
      subjects: ["Biology", "Chemistry", "Psychology"],
      bio: "Medical doctor and passionate science educator. I use visual aids, analogies, and interactive quizzes to make biology and chemistry accessible and enjoyable for every student.",
      hourlyRate: 16,
    });

    const teacher11 = await Teacher.create({
      name: "Olivia Brown",
      email: "teacher11@demo.com",
      password: "password123",
      country: "Australia",
      languages: ["English (Native)"],
      subjects: ["Web Development", "Data Science", "Programming"],
      bio: "Full-stack developer with 5 years at Google. Now I teach coding full-time because I love seeing that 'aha!' moment when a concept clicks. Beginner-friendly and project-based learning.",
      hourlyRate: 32,
    });

    const teacher12 = await Teacher.create({
      name: "Chen Wei",
      email: "teacher12@demo.com",
      password: "password123",
      country: "China",
      languages: ["Mandarin (Native)", "English (Fluent)", "Korean (Intermediate)"],
      subjects: ["Chinese", "Machine Learning", "Data Science"],
      bio: "AI researcher and Mandarin tutor. I combine my tech background with language teaching to offer a modern, engaging experience. Published in top ML conferences.",
      hourlyRate: 26,
    });

    console.log("Teachers created (12 total).");

    // --- STUDENTS ---
    const student1 = await Student.create({
      name: "Alex Chen",
      email: "student@demo.com",
      password: "password123",
      subscribedTeachers: [teacher1._id, teacher2._id, teacher5._id],
    });

    const student2 = await Student.create({
      name: "Maria Garcia",
      email: "student2@demo.com",
      password: "password123",
      subscribedTeachers: [teacher1._id, teacher3._id, teacher6._id],
    });

    const student3 = await Student.create({
      name: "James Wilson",
      email: "student3@demo.com",
      password: "password123",
      subscribedTeachers: [teacher2._id, teacher4._id],
    });

    const student4 = await Student.create({
      name: "Fatima Noor",
      email: "student4@demo.com",
      password: "password123",
      subscribedTeachers: [teacher4._id, teacher8._id],
    });

    // Update teacher subscriber lists
    await Teacher.findByIdAndUpdate(teacher1._id, { $push: { subscribers: { $each: [student1._id, student2._id] } } });
    await Teacher.findByIdAndUpdate(teacher2._id, { $push: { subscribers: { $each: [student1._id, student3._id] } } });
    await Teacher.findByIdAndUpdate(teacher3._id, { $push: { subscribers: { $each: [student2._id] } } });
    await Teacher.findByIdAndUpdate(teacher4._id, { $push: { subscribers: { $each: [student3._id, student4._id] } } });
    await Teacher.findByIdAndUpdate(teacher5._id, { $push: { subscribers: { $each: [student1._id] } } });
    await Teacher.findByIdAndUpdate(teacher6._id, { $push: { subscribers: { $each: [student2._id] } } });
    await Teacher.findByIdAndUpdate(teacher8._id, { $push: { subscribers: { $each: [student4._id] } } });

    console.log("Students created (4 total) + subscriptions synced.");

    // --- CLASSES ---
    await Class.create([
      {
        title: "Algebra Fundamentals",
        description: "Learn the basics of algebra including equations, inequalities, and functions.",
        subject: "math",
        teacher: teacher1._id,
        date: new Date("2026-03-10"),
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
        date: new Date("2026-03-11"),
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
        date: new Date("2026-03-12"),
        time: "11:00 AM",
        duration: "90 min",
        maxStudents: 30,
        enrolledStudents: [student1._id, student2._id, student3._id, student4._id],
        status: "scheduled",
      },
      {
        title: "World History: Modern Era",
        description: "Study major events from the 18th century to the present day.",
        subject: "history",
        teacher: teacher8._id,
        date: new Date("2026-03-13"),
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
        teacher: teacher9._id,
        date: new Date("2026-03-14"),
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
        teacher: teacher10._id,
        date: new Date("2026-03-15"),
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
        teacher: teacher11._id,
        date: new Date("2026-03-16"),
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
        teacher: teacher5._id,
        date: new Date("2026-02-10"),
        time: "2:00 PM",
        duration: "90 min",
        maxStudents: 15,
        enrolledStudents: [student3._id, student4._id],
        status: "completed",
      },
      {
        title: "Conversational Spanish",
        description: "Practice real-world Spanish conversation skills with native speaker guidance.",
        subject: "english",
        teacher: teacher6._id,
        date: new Date("2026-03-17"),
        time: "4:00 PM",
        duration: "45 min",
        maxStudents: 10,
        enrolledStudents: [student2._id],
        status: "scheduled",
      },
      {
        title: "Quran Recitation & Tajweed",
        description: "Learn proper Quran recitation with correct Tajweed rules and pronunciation.",
        subject: "arabic",
        teacher: teacher4._id,
        date: new Date("2026-03-18"),
        time: "8:00 AM",
        duration: "60 min",
        maxStudents: 8,
        enrolledStudents: [student3._id, student4._id],
        status: "scheduled",
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Introduction to ML concepts: regression, classification, neural networks.",
        subject: "programming",
        teacher: teacher12._id,
        date: new Date("2026-03-19"),
        time: "6:00 PM",
        duration: "90 min",
        maxStudents: 30,
        enrolledStudents: [student1._id],
        status: "scheduled",
      },
    ]);

    console.log("Classes created (11 total).");
    console.log("\n--- Seed Complete ---");
    console.log("Demo Accounts:");
    console.log("  Admin:    admin@demo.com     / password123");
    console.log("  Teacher:  teacher@demo.com   / password123");
    console.log("  Student:  student@demo.com   / password123");
    console.log("  (12 teachers, 4 students total)");
    console.log("--------------------\n");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
