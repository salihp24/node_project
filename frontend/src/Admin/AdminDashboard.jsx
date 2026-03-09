import React, { useEffect, useState } from "react"
import axios from "axios"
import "./AdminDashboard.css"

function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [orders, setOrders] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/products"),
          axios.get("http://localhost:3001/orders")
        ])

        setUsersCount(usersRes.data.length)
        setProductsCount(productsRes.data.length)
        setOrders(ordersRes.data)

        const revenue = ordersRes.data.reduce(
          (sum, order) => sum + Number(order.totalAmount || 0),
          0
        )

        setTotalRevenue(revenue)
      } catch (error) {
        console.error("Dashboard data fetch failed", error)
      }
    }

    fetchDashboardData()
  }, [])

  const recentOrders = orders.slice(-5).reverse()

  return (
    <div className="admin-dashboard" style={{width:"1121px"}}>
      <h2 className="dashboard-title">Admin Dashboard</h2>

      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p>{usersCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>{productsCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Last 5 Orders</h3>

        {recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.userName}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default AdminDashboard