const Student = require("../models/student");
const User = require("../models/users");
const sendEmail = require("../utils/sendEmail");

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error("FETCH TEACHERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.approveTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await User.findOne({
      _id: id,
      role: "teacher"
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.isApproved) {
      return res.status(400).json({ message: "Teacher already approved" });
    }

    teacher.isApproved = true;
    await teacher.save();

    // Send approval email
    try {
      await sendEmail(
        teacher.email,
        "Your teacher account has been approved. You can now log in."
      );
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Teacher approved successfully"
    });
  } catch (error) {
    console.error("APPROVE TEACHER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalStudents = await Student.countDocuments({isDeleted: false});

    const students = await Student.find({isDeleted: false})
      .populate("teacher", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      students,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.deleteStudentsInstant = async (req, res) => {
//   try {
//     const { studentIds } = req.body;

//     await Student.deleteMany({ _id: { $in: studentIds } });
//     await User.deleteMany({ student: { $in: studentIds } });

//     res.json({ message: "Students deleted instantly" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.deleteStudentsInstant = async (req, res) => {
  try {
    const { studentIds } = req.body;
    const io = req.app.get("io");

    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      }
    );

    studentIds.forEach((id) => {
      io.to(id).emit("studentDeleted", {
        message: "Your account has been deleted by admin",
      });
    });

    res.json({ message: "Students deleted instantly" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.scheduleDeleteStudents = async (req, res) => {
//   try {
//     const { studentIds, delayMinutes } = req.body;

//     const deleteTime = new Date(Date.now() + delayMinutes * 60000);

//     await Student.updateMany(
//       { _id: { $in: studentIds } },
//       {
//         isDeleted: true,
//         deleteAt: deleteTime,
//       }
//     );

//     res.json({ message: "Students scheduled for deletion" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.scheduleDeleteStudents = async (req, res) => {
  try {
    const { studentIds, delaySeconds } = req.body;

    if (!delaySeconds || delaySeconds <= 0) {
      return res.status(400).json({ message: "Invalid delay" });
    }

    const deleteTime = new Date(Date.now() + delaySeconds * 1000);

    await Student.updateMany(
      { _id: { $in: studentIds } },
      { deleteAt: deleteTime }
    );

    res.json({ message: "Students scheduled for deletion" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.migrateStudentsSoftDeleteFields = async (req, res) => {
  try {
    const result = await Student.updateMany(
      {
        $or: [
          { isDeleted: { $exists: false } },
          { deletedBy: { $exists: false } }
        ]
      },
      {
        $set: {
          isDeleted: false,
          deletedBy: null
        }
      }
    );

    res.json({
      message: "Students migration successful",
      matched: result.matchedCount,
      modified: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
