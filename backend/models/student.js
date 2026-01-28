const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      type: String,
      default: ""
    },
    department: {
      type: String,
      required: true
    },
    courses: {
      type: [String],
      default: []
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleteBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deletedAt:{
      type: Date,
      default: null
    },
    deleteAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
