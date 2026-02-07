import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={register}>
        <h2>Create Account</h2>
        <p className="subtitle">Join the library system</p>

        {error && <p className="error">{error}</p>}

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
