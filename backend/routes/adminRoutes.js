const express = require("express");
const {auth, adminOnly} = require("../middlewares/authMiddleware");
const {
  deleteStudentsInstant,scheduleDeleteStudents,
  migrateStudentsSoftDeleteFields,
  getAllTeachers,
  approveTeacher,
} = require("../controllers/adminControllers");

const { getAllStudents } = require("../controllers/adminControllers.js");

const router = express.Router();

router.get("/students", auth, getAllStudents)
router.get("/teachers", auth, adminOnly, getAllTeachers);
router.put("/teachers/:id/approve", auth, adminOnly, approveTeacher);

router.delete(
  "/students/instant",
  auth,
  adminOnly,
  deleteStudentsInstant
);

router.put(
  "/students/schedule",
  auth,
  adminOnly,
  scheduleDeleteStudents
);

router.put(
  "/migrate/students-soft-delete",
  auth,
  adminOnly,
  migrateStudentsSoftDeleteFields
);


module.exports = router;
