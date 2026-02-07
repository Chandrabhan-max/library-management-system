import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);

  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfile(null);
      return;
    }

    api
      .get("/auth/profile")
      .then((res) => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setProfile(null);
        navigate("/login");
      });
  }, [location.pathname, navigate]);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo" onClick={() => navigate("/home")}>
          📚 BookVault
        </div>

        <div className="nav-links">
          <NavLink to="/home" label="Home" />
          <NavLink to="/resources" label="Books" />
          <NavLink to="/my-books" label="My Books" />

          {profile?.role === "ADMIN" && (
            <NavLink to="/admin" label="Admin Control" />
          )}
        </div>
      </div>

      <div ref={ref} className="profile">
        <div className="avatar" onClick={() => setOpen(!open)}>
          {profile?.email ? profile.email[0].toUpperCase() : "👤"}
        </div>

        {open && (
          <div className="dropdown">
            <div className="dropdown-header">
              <div className="email">{profile?.email}</div>
              <div className="role">{profile?.role}</div>
            </div>

            <button className="dropdown-btn" onClick={() => navigate("/profile")}>
              View Profile
            </button>

            <button
              className="dropdown-btn logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, label }) {
  const location = useLocation();
  const active = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`nav-link ${active ? "active" : ""}`}
    >
      {label}
    </Link>
  );
}
