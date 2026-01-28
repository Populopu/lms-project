const express = require("express");
const router = express.Router();

const { auth, teacherOnly } = require("../middlewares/authMiddleware");
const uploadAvatar = require("../middlewares/uploadAvatar");

const {
  addStudent,
  getStudents,
  getMyProfile,
  updateStudent,
  uploadStudentAvatar,
} = require("../controllers/studentControllers");


router.post("/", auth, teacherOnly, addStudent);
router.get("/", auth, teacherOnly, getStudents);
router.put("/:id", auth, teacherOnly, updateStudent);

router.get("/me", auth, getMyProfile);
router.put(
  "/avatar",
  auth,
  uploadAvatar.single("avatar"),
  uploadStudentAvatar
);

module.exports = router;
