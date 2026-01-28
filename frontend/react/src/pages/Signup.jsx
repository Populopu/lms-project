import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  };

  return (
    <div className="auth-box">
      <h2>Teacher Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn btn-primary" style={{ width: "100%" }}>
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        Already registered?{" "}
        <span
          style={{ color: "#2563eb", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
