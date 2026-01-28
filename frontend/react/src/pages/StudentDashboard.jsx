import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../styles/studentDashboard.css"; // Make sure CSS file exists
import { useNavigate } from "react-router-dom";
import socket from "../socket.js";
const BASE_URL = "http://localhost:5000";


export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSaveCancel, setShowSaveCancel] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const defaultAvatar =
    "https://www.gravatar.com/avatar/?d=mp&f=y"; // fallback avatar

  useEffect(() => {
    fetchStudent();
  }, []);

useEffect(() => {
  if (!student?._id) return;

  socket.connect();
  socket.emit("registerStudent", student._id);

  const handler = (data) => {
    toast.error(data.message);

    setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, 3000);
  };

  socket.on("studentDeleted", handler);

  return () => {
    socket.off("studentDeleted", handler);
    socket.disconnect();
  };
}, [student, navigate]);


  const fetchStudent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStudent(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowSaveCancel(true);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setShowSaveCancel(false);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/students/avatar", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Avatar updated");
      setStudent((prev) => ({ ...prev, avatar: data.avatar }));
      setSelectedFile(null);
      setShowSaveCancel(false);
    } catch (err) {
      toast.error(err.message);
    }
  };


  const logout = () => {
    toast.info("Logged out");
    localStorage.clear();
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };


  if (!student) return null;

  return (
    <div className="student-dashboard-container">
      <div className="top-bar">
        <h1>Student Dashboard</h1>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="profile-card">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : student.avatar
                    ? `${BASE_URL}${student.avatar}`
                    : defaultAvatar
              }
              alt="Avatar"
              className="avatar"
            />

            <div className="avatar-hover">
              <button
                className="btn btn-primary"
                onClick={() =>
                  document.getElementById("avatarInput").click()
                }
              >
                Change Avatar
              </button>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            id="avatarInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {showSaveCancel && (
            <div className="avatar-buttons">
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>{student.name}</h2>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Department:</strong> {student.department}
          </p>
          <p>
            <strong>Courses:</strong>{" "}
            {student.courses.length ? student.courses.join(", ") : "N/A"}
          </p>
          <p>
            <strong>Teacher:</strong> {student.teacher?.name || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
