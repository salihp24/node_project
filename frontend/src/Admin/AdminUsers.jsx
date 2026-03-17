import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../api/apiClient"
import "./AdminUsers.css"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  const fetchUsers = async (query = "", page = 1) => {
    try {
      const res = await apiClient.get(`/admin/users?search=${query}&page=${page}&limit=5`)
      setUsers(res.data.users)
      setTotalPages(res.data.totalPages)
      setCurrentPage(res.data.currentPage)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleBlock = async (user) => {
    try {
      await apiClient.patch(`/admin/users/${user._id}/block-status`, {
        isBlocked: !user.isBlocked
      })
      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? { ...u, isBlocked: !u.isBlocked }
            : u
        )
      )
    } catch (error) {
      console.error("Error updating block status:", error)
    }
  }

  const viewUser = (id) => {
    navigate(`/admin/users/${id}`)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
    fetchUsers(e.target.value, 1)
  }

  const handlePageChange = (page) => {
    fetchUsers(search, page)
  }

  return (
    <div className="admin-users-container">
      <h1 className="admin-users-header">User Management</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={handleSearch}
        className="user-search-input"
      />

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
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.isBlocked ? "status-blocked" : "status-active"}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-view"
                        onClick={() => viewUser(user._id)}
                      >
                        View
                      </button>
                      <button
                        className={`btn ${user.isBlocked ? "btn-activate" : "btn-block"}`}
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

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? "page-active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

    </div>
  )
}

export default AdminUsers