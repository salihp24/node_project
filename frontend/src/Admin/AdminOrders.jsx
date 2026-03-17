import React, { useEffect, useState } from "react"
import apiClient from '../api/apiClient'
import "./AdminOrders.css"

function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await apiClient.get("/admin/orders")
                setOrders(data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load orders")
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <p className="no-orders">Loading...</p>
    if (error) return <p className="no-orders">{error}</p>

    return (
        <div className="admin-orders">
            <h2 className="orders-title">Orders</h2>

            {orders.length === 0 ? (
                <p className="no-orders">No orders found</p>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-6)}</td>
                                    <td>{order.userId?.username || "Deleted User"}</td>
                                    <td>{order.userId?.email || "-"}</td>
                                    <td>{order.totalItems}</td>
                                    <td className="amount">
                                        ₹{order.totalPrice.toLocaleString("en-IN")}
                                    </td>
                                    <td>
                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminOrders