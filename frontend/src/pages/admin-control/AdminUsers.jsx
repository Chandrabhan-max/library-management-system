import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [confirmRole, setConfirmRole] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const applyRoleChange = async () => {
    try {
      setActionLoading(confirmRole.userId);
      await api.patch(`/users/${confirmRole.userId}`, {
        role: confirmRole.role,
      });
      setConfirmRole(null);
      loadUsers();
    } catch {
      alert("Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const applyDelete = async () => {
    try {
      setActionLoading(confirmDelete);
      await api.delete(`/users/${confirmDelete}`);
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete));
      setConfirmDelete(null);
    } catch {
      alert("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">
      <h2>Manage Users</h2>

      <input
        className="search"
        placeholder="Search by name, email, role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <div className="empty">No users found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="role">{u.role}</td>
                <td className="actions-col">
                  <div className="actions">
                    <select
                      className="role-select"
                      disabled={actionLoading === u.id}
                      defaultValue=""
                      onChange={(e) =>
                        setConfirmRole({
                          userId: u.id,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Change Role
                      </option>
                      {u.role !== "STUDENT" && (
                        <option value="STUDENT">Make Student</option>
                      )}
                      {u.role !== "TEACHER" && (
                        <option value="TEACHER">Make Teacher</option>
                      )}
                      {u.role !== "ADMIN" && (
                        <option value="ADMIN">Make Admin</option>
                      )}
                    </select>

                    <button
                      className={`btn-danger ${
                        actionLoading === u.id ? "btn-disabled" : ""
                      }`}
                      disabled={actionLoading === u.id}
                      onClick={() => setConfirmDelete(u.id)}
                    >
                      Delete
                    </button>

                    {confirmRole?.userId === u.id && (
                      <div className="confirm-pop">
                        <p>Confirm role change?</p>
                        <div className="confirm-actions">
                          <button
                            className="confirm-btn confirm-yes"
                            onClick={applyRoleChange}
                          >
                            Confirm
                          </button>
                          <button
                            className="confirm-btn confirm-no"
                            onClick={() => setConfirmRole(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {confirmDelete === u.id && (
                      <div className="confirm-pop">
                        <p>Delete this user?</p>
                        <div className="confirm-actions">
                          <button
                            className="confirm-btn confirm-yes"
                            onClick={applyDelete}
                          >
                            Delete
                          </button>
                          <button
                            className="confirm-btn confirm-no"
                            onClick={() => setConfirmDelete(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
