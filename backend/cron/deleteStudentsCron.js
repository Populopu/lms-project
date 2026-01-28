// const cron = require("node-cron");
// const Student = require("../models/student");
// const User = require("../models/users");
// const fs = require("fs");
// const path = require("path");

// cron.schedule("*/1 * * * *", async () => {
//   try {
//     const now = new Date();

//     const studentsToDelete = await Student.find({
//       isDeleted: true,
//       deleteAt: { $lte: now },
//     });

//     for (const student of studentsToDelete) {
//       // delete avatar file if exists
//       if (student.avatar) {
//         const avatarPath = path.join(__dirname, "..", student.avatar);
//         if (fs.existsSync(avatarPath)) {
//           fs.unlinkSync(avatarPath);
//         }
//       }

//       await User.deleteOne({ _id: student.user });
//       await Student.deleteOne({ _id: student._id });
//     }
//   } catch (err) {
//     console.error("Cron job error:", err.message);
//   }
// });

const cron = require("node-cron");
const Student = require("../models/student");

module.exports = (io) => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const studentsToDelete = await Student.find({
        isDeleted: false,
        deleteAt: { $lte: now },
      });

      if (studentsToDelete.length === 0) return;

      for (const student of studentsToDelete) {
        student.isDeleted = true;
        student.deletedAt = now;
        student.deleteAt = null;
        await student.save();

        // 🔔 SOCKET EVENT
        io.to(student._id.toString()).emit("studentDeleted", {
          message: "Your account has been deleted by admin (scheduled)",
        });
      }

      console.log(
        `CRON: Deleted ${studentsToDelete.length} scheduled students`
      );
    } catch (err) {
      console.error("CRON DELETE ERROR:", err.message);
    }
  });
};
