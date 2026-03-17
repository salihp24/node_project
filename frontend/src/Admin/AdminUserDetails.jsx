import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import apiClient from "../api/apiClient"
import "./AdminUserDetails.css"

function AdminUserDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/admin/users/${id}`)

        setUser(res.data.user)
        setOrders(res.data.orders || [])

      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (loading) {
    return <div className="user-details-container">Loading...</div>
  }

  if (!user) {
    return <div className="user-details-container">User not found</div>
  }

  return (
    <div className="user-details-container">

      <div className="details-header">
        <h2>User Details</h2>

        <button
          className="back-btn"
          onClick={() => navigate("/admin/users")}
        >
          ← Back to Users
        </button>
      </div>

      <div className="details-card">

        <div className="detail-row">
          <span className="detail-label">Username</span>
          <span className="detail-value">{user.username}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{user.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Account Status</span>

          <span className={`status-badge ${user.isBlocked ? "blocked" : "active"}`}>
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">User ID</span>
          <span className="detail-value">{user._id}</span>
        </div>

      </div>

      {/* Orders Section */}

      <div className="orders-section">

        <h3>User Orders</h3>

        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Products</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>

                  <td>{order._id}</td>

                  <td>
                    {order.products.map(p => (
                      <div key={p._id}>
                        {p.productId?.title} × {p.quantity}
                      </div>
                    ))}
                  </td>

                  

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  )
}

export default AdminUserDetails