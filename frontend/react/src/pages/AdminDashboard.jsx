import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // popup control
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showInstantPopup, setShowInstantPopup] = useState(false);

  // schedule time
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);



  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [page]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/students?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
      setTotalStudents(data.totalStudents || 0);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/teachers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedStudents(students.map((s) => s._id));
  };

  const handleInstantDelete = async () => {
    try {
      await fetch("http://localhost:5000/api/admin/students/instant", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentIds: selectedStudents }),
      });

      toast.success("Students deleted successfully");
      setShowInstantPopup(false);
      setSelectedStudents([]);
      fetchStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleScheduleDelete = async () => {
    const totalSeconds =
      Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

    if (totalSeconds <= 0) {
      toast.error("Please enter a valid time");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/admin/students/schedule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentIds: selectedStudents,
          delaySeconds: totalSeconds,
        }),
      });

      toast.success("Deletion scheduled successfully");
      setShowSchedulePopup(false);
      setSelectedStudents([]);
      fetchStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const approveTeacher = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/teachers/${id}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Teacher approved");
      fetchTeachers(); // refresh list
    } catch (err) {
      toast.error(err.message || "Approval failed");
    }
  };


  return (
    <div className="admin-dashboard">
      <div className="top-bar">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <h2>Teachers</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="4">No teachers found</td>
            </tr>
          ) : (
            teachers.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>
                  {t.isApproved ? (
                    <span style={{ color: "green" }}>Approved</span>
                  ) : (
                    <span style={{ color: "orange" }}>Pending</span>
                  )}
                </td>
                <td>
                  {!t.isApproved ? (
                    <button
                      className="btn btn-success"
                      onClick={() => approveTeacher(t._id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Approved
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>


      <h2>All Students</h2>
      <p className="student-count">
        Total Active Students: <strong>{totalStudents}</strong>
      </p>
      <div className="admin-actions">
        <button className="btn btn-secondary" onClick={selectAll}>
          Select All
        </button>

        <button
          className="btn btn-danger"
          disabled={selectedStudents.length === 0}
          onClick={() => setShowInstantPopup(true)}
        >
          Delete Instantly
        </button>

        <button
          className="btn btn-warning"
          disabled={selectedStudents.length === 0}
          onClick={() => setShowSchedulePopup(true)}
        >
          Schedule Delete
        </button>

      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Teacher</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s._id)}
                    onChange={() => toggleSelect(s._id)}
                  />
                </td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.teacher?.name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
      {showInstantPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to permanently delete selected students?</p>

            <div className="popup-actions">
              <button className="btn btn-danger" onClick={handleInstantDelete}>
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowInstantPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSchedulePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Schedule Deletion</h3>

            <div className="time-inputs">
              <input
                type="number"
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0"
              />
              <input
                type="number"
                placeholder="Minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                min="0"
              />
              <input
                type="number"
                placeholder="Seconds"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                min="0"
              />
            </div>

            <p>
              Are you sure you want to schedule deletion after{" "}
              <strong>
                {hours}h {minutes}m {seconds}s
              </strong>
              ?
            </p>

            <div className="popup-actions">
              <button className="btn btn-warning" onClick={handleScheduleDelete}>
                Confirm
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowSchedulePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
