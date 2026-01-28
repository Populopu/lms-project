const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Student = require("../models/student");
const sendEmail = require("../utils/sendEmail");


exports.addStudent = async (req, res) => {
  try {
    const { name, email, department, courses } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const student = await Student.create({
      name,
      email,
      department,
      courses,
      teacher: req.user.id,
    });

    let emailSent = true;
    try {
      await sendEmail(email, generatedPassword);
    } catch (err) {
      console.error("Email failed:", err.message);
      emailSent = false;
    }

    res.status(201).json({
      success: true,
      student,
      emailSent,
    });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      teacher: req.user.id,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    res.json({ students, total });
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.user.email })
      .populate("teacher", "name email");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, courses } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.department = department || student.department;
    student.courses = courses || student.courses;

    await student.save();

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadStudentAvatar = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.user.email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.avatar = `/uploads/avatars/${req.file.filename}`;
    await student.save();

    res.json({
      message: "Avatar updated",
      avatar: student.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
