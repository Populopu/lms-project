// const mongoose = require("mongoose");
// const User = require("../models/users");
// require("dotenv").config();

// const updateOldTeachers = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB connected");

//     const result = await User.updateMany(
//       {
//         role: "teacher",
//         isApproved: { $exists: false }
//       },
//       {
//         $set: { isApproved: true }
//       }
//     );

//     console.log("Teachers updated:", result.modifiedCount);

//     process.exit();
//   } catch (error) {
//     console.error("Error updating teachers:", error);
//     process.exit(1);
//   }
// };

// updateOldTeachers();
