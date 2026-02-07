import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/home");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={login} className="auth-card">
        <h2>Login</h2>
        <p className="subtitle">Welcome back</p>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Login</button>

        <p className="switch">
          No account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}
