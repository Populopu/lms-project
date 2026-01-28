// const bcrypt = require("bcryptjs");
// const User = require("../models/users")
// const jwt = require("jsonwebtoken");

// exports.signup= async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         if (password.length < 6) {
//             return res
//                 .status(400)
//                 .json({ message: "Password must be at least 6 characters" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const teacher = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role: "teacher",
//             isApproved: false 
//         });

//         res.status(201).json({
//             success: true,
//             message: "Signup successful. Waiting for admin approval."
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };


// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }
        
//         if (user.role === "teacher" && !user.isApproved) {
//             return res.status(403).json({
//                 message: "Account pending admin approval"
//             });
//         }

//         const token = jwt.sign(
//             { id: user._id, role: user.role, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );


//         res.json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

// exports.createAdmin = async (req, res) => {
//   try {
//     const { name, email, password, secret } = req.body;

//     if (secret !== process.env.ADMIN_SECRET) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin"
//     });

//     res.status(201).json({ message: "Admin created successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// }

const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Student = require("../models/student");
const jwt = require("jsonwebtoken");

/* ======================
   TEACHER SIGNUP
====================== */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      isApproved: false // ⛔ must be approved by admin
    });

    res.status(201).json({
      success: true,
      message: "Signup successful. Waiting for admin approval."
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   LOGIN (ALL ROLES)
====================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* 🔒 Teacher approval check */
    if (user.role === "teacher" && !user.isApproved) {
      return res.status(403).json({
        message: "Account pending admin approval"
      });
    }

    /* 🔥 Student deleted check */
    if (user.role === "student") {
      const student = await Student.findOne({ email: user.email });

      if (!student || student.isDeleted) {
        return res.status(403).json({
          message: "Your account has been deleted by admin"
        });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   CREATE ADMIN
====================== */
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isApproved: true
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
