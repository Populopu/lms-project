// const mongoose = require("mongoose");
// require("dotenv").config();

// const Student = require("../models/student");

// async function migrateStudents() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");

//     const result = await Student.updateMany(
//       {
//         $or: [
//           { isDeleted: { $exists: false } },
//           { deletedBy: { $exists: false } },
//           { deleteAt: { $exists: false } }
//         ]
//       },
//       {
//         $set: {
//           isDeleted: false,
//           deletedBy: null,
//           deleteAt: null
//         }
//       }
//     );

//     console.log("Migration completed");
//     console.log("Matched:", result.matchedCount);
//     console.log("Modified:", result.modifiedCount);

//     process.exit(0);
//   } catch (err) {
//     console.error("Migration failed:", err);
//     process.exit(1);
//   }
// }

// migrateStudents();
