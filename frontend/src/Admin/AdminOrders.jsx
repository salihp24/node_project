import React, { useEffect, useState } from "react"
import axios from "axios"
import "./AdminOrders.css"

function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3001/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
  }, [])

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
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.userName}</td>
                  <td>{order.userEmail}</td>
                  <td className="amount">₹{order.totalAmount}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={`status ${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
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
