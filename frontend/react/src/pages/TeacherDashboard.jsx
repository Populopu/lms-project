// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function TeacherDashboard() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   const [students, setStudents] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalStudents, setTotalStudents] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [mode, setMode] = useState("LIST");
//   const [editingId, setEditingId] = useState(null);


//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     department: "",
//     courses: ""
//   });


//   const fetchStudents = async () => {
//     const res = await fetch(
//       `http://localhost:5000/api/students?page=${page}&limit=5&search=${searchTerm}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     const data = await res.json();
//     setStudents(data.students || []);
//     setTotalStudents(data.total || 0);
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [page, searchTerm]);

//   const handleAddStudent = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:5000/api/students", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           ...form,
//           courses: form.courses
//             ? form.courses.split(",").map(c => c.trim())
//             : []
//         })
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       toast.success("Student added successfully");
//       setShowForm(false);
//       setForm({ name: "", email: "", department: "", courses: "" });
//       fetchStudents();
//     } catch (err) {
//       toast.error(err.message || "Failed to add student");
//     }
//   };

//   const handleUpdateStudent = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/students/${editingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             ...form,
//             courses: form.courses
//               ? form.courses.split(",").map(c => c.trim())
//               : []
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       toast.success("Student updated");
//       resetForm();
//       fetchStudents();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };
//   const resetForm = () => {
//     setForm({ name: "", email: "", department: "", courses: "" });
//     setEditingId(null);
//     setMode("LIST");
//   };


//   const startEdit = (student) => {
//     setMode("EDIT");
//     setEditingId(student._id);
//     setForm({
//       name: student.name,
//       email: student.email,
//       department: student.department,
//       courses: student.courses.join(", ")
//     });
//   };


//   const navigate = useNavigate();
//   const logout = () => {
//     toast.info("Logged out");
//     localStorage.clear();
//     setTimeout(() => {
//       navigate("/login");
//     }, 500);
//   };

//   return (
//     <div className="container">
//       <div className="top-bar">
//         <h1>Welcome to Teacher Dashboard, {user.name}</h1>
//         <button className="btn btn-danger" onClick={logout}>
//           Logout
//         </button>
//       </div>

//       <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
//         <input
//           className="input"
//           placeholder="Search by name or email"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setPage(1);
//           }}
//           style={{ maxWidth: "300px" }}
//         />

//         <button className="btn btn-primary" onClick={() => setMode("ADD")}>
//           Add Student
//         </button>

//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Courses</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.length === 0 ? (
//             <tr>
//               <td colSpan="4">No students found</td>
//             </tr>
//           ) : (
//             students.map((s) => (
//               <tr key={s._id}>
//                 <td>{s.name}</td>
//                 <td>{s.email}</td>
//                 <td>{s.department}</td>
//                 <td>{s.courses.join(", ")}</td>
//                 <td>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => startEdit(s)}
//                   >
//                     Edit
//                   </button>
//                 </td>

//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {editingStudent && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <h3>Edit Student</h3>

//             <input
//               type="text"
//               value={editingStudent.name}
//               onChange={(e) =>
//                 setEditingStudent({ ...editingStudent, name: e.target.value })
//               }
//             />

//             <input
//               type="email"
//               value={editingStudent.email}
//               onChange={(e) =>
//                 setEditingStudent({ ...editingStudent, email: e.target.value })
//               }
//             />

//             <input
//               type="text"
//               value={editingStudent.department}
//               onChange={(e) =>
//                 setEditingStudent({
//                   ...editingStudent,
//                   department: e.target.value,
//                 })
//               }
//             />

//             <input
//               type="text"
//               value={editingStudent.courses.join(", ")}
//               onChange={(e) =>
//                 setEditingStudent({
//                   ...editingStudent,
//                   courses: e.target.value.split(",").map(c => c.trim()),
//                 })
//               }
//             />

//             <div className="popup-actions">
//               <button className="btn btn-success" onClick={handleUpdateStudent}>
//                 Save
//               </button>
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => setEditingStudent(null)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="pagination">
//         <button
//           className="btn btn-secondary"
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           Prev
//         </button>

//         <button
//           className="btn btn-secondary"
//           disabled={page * 5 >= totalStudents}
//           onClick={() => setPage(page + 1)}
//         >
//           Next
//         </button>

//         <span>
//           Page {page} of {Math.ceil(totalStudents / 5) || 1}
//         </span>
//       </div>

//       {showForm && (
//         <div className="modal">
//           <form className="modal-content" onSubmit={handleAddStudent}>
//             <h3>Add Student</h3>
//             {error && <p className="error">{error}</p>}

//             <input
//               className="input"
//               placeholder="Name"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />

//             <input
//               className="input"
//               placeholder="Email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//             />

//             <input
//               className="input"
//               placeholder="Department"
//               value={form.department}
//               onChange={(e) =>
//                 setForm({ ...form, department: e.target.value })
//               }
//             />

//             <input
//               className="input"
//               placeholder="Courses (comma separated)"
//               value={form.courses}
//               onChange={(e) => setForm({ ...form, courses: e.target.value })}
//             />

//             <button className="btn btn-primary">Add</button>
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/teacherDashboard.css"

const DEPARTMENTS = ["Computer Science", "Software Engineering", "IT", "AI"];
const COURSES = ["React", "Node", "MongoDB", "Express", "JavaScript"];

export default function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    courses: []
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students?page=${page}&limit=5&search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStudents(data.students || []);
      setTotalStudents(data.total || 0);
    } catch (err) {
      toast.error(err.message || "Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingStudent
        ? `http://localhost:5000/api/students/${editingStudent._id}`
        : "http://localhost:5000/api/students";

      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(
        editingStudent ? "Student updated successfully" : "Student added successfully"
      );

      setShowForm(false);
      setEditingStudent(null);
      setForm({ name: "", email: "", department: "", courses: [] });
      fetchStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      department: student.department,
      courses: student.courses
    });
    setShowForm(true);
  };

  const logout = () => {
    toast.info("Logged out");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h2>Teacher Dashboard – {user.name}</h2>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="actions">
        <input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingStudent(null);
            setForm({ name: "", email: "", department: "", courses: [] });
          }}
        >
          Add Student
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Courses</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="5">No students found</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>{s.courses.join(", ")}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(totalStudents / 5) || 1}
        </span>
        <button disabled={page * 5 >= totalStudents} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleSubmit}>
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              multiple
              value={form.courses}
              onChange={(e) =>
                setForm({
                  ...form,
                  courses: Array.from(e.target.selectedOptions, o => o.value)
                })
              }
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn btn-success">
                {editingStudent ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

