import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  const active =
    location.pathname.includes("/admin/users")
      ? "users"
      : location.pathname.includes("/admin/books")
      ? "books"
      : null;

  return (
    <div className="admin-layout">
      <div className="admin-tabs-container">
        <div className="admin-tabs">
          <div
            className={`admin-tab ${active === "users" ? "active" : ""}`}
            onClick={() => navigate("/admin/users")}
          >
            <span className="admin-icon">👥</span>
            Users
          </div>

          <div
            className={`admin-tab ${active === "books" ? "active" : ""}`}
            onClick={() => navigate("/admin/books")}
          >
            <span className="admin-icon">📚</span>
            Books
          </div>
        </div>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
