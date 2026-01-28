const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  createAdmin,
} = require("../controllers/authControllers");

const {
  validateSignup,
  validateLogin,
  validateAdminCreate,
} = require("../middlewares/validationMiddleware");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/admin", validateAdminCreate, createAdmin);

module.exports = router;

