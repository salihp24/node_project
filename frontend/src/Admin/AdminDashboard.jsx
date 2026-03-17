import React, { useEffect, useState } from "react"
import apiClient from "../api/apiClient"
import "./AdminDashboard.css"

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProductsPurchased: 0
    })
    const [usersCount, setUsersCount] = useState(0)
    const [productsCount, setProductsCount] = useState(0)
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
                    apiClient.get("/admin/dashboard"),
                    apiClient.get("/admin/users"),
                    apiClient.get("/admin/products"),
                    apiClient.get("/admin/orders")
                ])

                setStats(statsRes.data)
                setUsersCount(usersRes.data.length)
                setProductsCount(productsRes.data.length)
                setRecentOrders(ordersRes.data.slice(-5).reverse())

            } catch (error) {
                console.error("Dashboard fetch failed", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div className="admin-dashboard">
            <h2 className="dashboard-title">Admin Dashboard</h2>

            {/* Stats Cards */}
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
                    <p>{stats.totalOrders}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Revenue</h3>
                    <p>₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                </div>
            </div>

            {/* Recent Orders */}
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
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-6)}</td>
                                    <td>{order.userId?.username || "Deleted User"}</td>
                                    <td>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                                    <td>
                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
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