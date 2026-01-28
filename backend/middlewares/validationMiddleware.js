
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      message: "Name must be at least 3 characters long",
    });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, and number",
    });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  next();
};

exports.validateAdminCreate = (req, res, next) => {
  const { name, email, password, secret } = req.body;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({
      message: "Invalid admin secret",
    });
  }

  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      message: "Name must be at least 3 characters long",
    });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, and number",
    });
  }

  next();
};
