import React, { useEffect, useState } from "react";
import { userAPI } from "../../services/api";
import Navbar from "../../components/Navbar";
import "./users.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAllUsers();
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-users">
        <div className="admin-users-header">
          <h1>All Users</h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="admin-users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`role ${
                            user.role === "admin" ? "admin" : "user"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;