import { useEffect, useState } from "react"
import axios from "axios"
import "./AdminUsers.css"

function AdminUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3001/users")
      .then(res => setUsers(res.data))
  }, [])

  const toggleBlock = async (user) => {
    await axios.patch(
      `http://localhost:3001/users/${user.id}`,
      { isBlocked: !user.isBlocked }
    )

    setUsers(prev =>
      prev.map(u =>
        u.id === user.id
          ? { ...u, isBlocked: !u.isBlocked }
          : u
      )
    )
  }

  return (
    <div className="admin-users-container">
      <h1 className="admin-users-header">User Management</h1>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  <p>No users found</p>
                  <small>Users will appear here once registered</small>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.isBlocked ? 'status-blocked' : 'status-active'}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      

                      <button 
                        className={`btn ${user.isBlocked ? 'btn-activate' : 'btn-block'}`}
                        onClick={() => toggleBlock(user)}
                      >
                        {user.isBlocked ? "Activate" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
