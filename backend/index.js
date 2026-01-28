// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();
// require("./cron/deleteStudentsCron");
// const path = require("path");

// const http = require("http");
// const { Server } = require("socket.io");
// const PORT= 5000;
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5000",
//     credentials: true
//   }
// });

// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   socket.on("registerStudent", (studentId) => {
//     socket.join(studentId);
//     console.log("Student joined room:", studentId);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });


// const authRoutes = require("./routes/authRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const adminRoutes = require("./routes/adminRoutes.js");


// const app = express();

// app.use(cors());
// app.use(express.json());


// app.use("/api/auth", authRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/admin", adminRoutes);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => console.error(err));

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("registerStudent", (studentId) => {
    socket.join(studentId);
    console.log("Student joined room:", studentId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const deleteStudentsCron = require("./cron/deleteStudentsCron");
deleteStudentsCron(io);

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
