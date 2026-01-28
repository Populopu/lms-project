import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/login.css"

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful");

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <div className="password-field">
          <input
          className="input"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="button"
          className="show-password-btn"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        </div>
        

        <button className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}
