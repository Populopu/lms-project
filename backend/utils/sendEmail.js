const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, password) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Your LMS Login Credentials",
    html: `
      <h3>Welcome to LMS</h3>
      <p>Email: ${to}</p>
      <p>Password: ${password}</p>
    `
  });
};
