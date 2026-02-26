"use client";

import { useEffect, useState } from "react";


export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Activate / Deactivate user
  const toggleUser = async (user_id, is_active) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        is_active: is_active ? 0 : 1,
      }),
    });

    fetchUsers();
  };

  return (
    <>
  

      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="mb-4">Registered Users</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, index) => (
                <tr key={u.user_id}>
                  <td>{index + 1}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.mobile || "-"}</td>
                  <td>
                    <span
                      className={
                        u.role === "ADMIN"
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        u.is_active ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() => toggleUser(u.user_id, u.is_active)}
                    >
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
