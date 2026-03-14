import React, { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import "./my-orders.css"

function MyOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            setError("")
            try {
                const { data } = await apiClient.get("/orders/my-orders")
                setOrders(data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load orders")
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <p className="orders-status">Loading...</p>
    if (error)   return <p className="orders-status orders-error">{error}</p>
    if (orders.length === 0) return <p className="orders-status">No orders found</p>

    return (
        <div className="orders-wrapper">
            <h2 className="orders-heading">My Orders</h2>
            <hr className="orders-divider" />

            {orders.map(order => (
                <div key={order._id} className="order-card">

                    {/* Order Header */}
                    <div className="order-header">
                        <div className="order-meta">
                            <span className="order-id">Order ID: {order._id}</span>
                            <span className="order-date">
                                {new Date(order.purchaseDate).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </span>
                        </div>
                        <span className="order-status">Confirmed</span>
                    </div>

                    <hr className="order-inner-divider" />

                    {/* Order Items */}
                    {order.products.map(item => (
                        <div key={item._id} className="order-item">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="order-item-image"
                            />
                            <div className="order-item-info">
                                <h3 className="order-item-name">{item.name}</h3>
                                <p className="order-item-price">₹{item.price.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="order-item-qty">
                                Qty: {item.quantity}
                            </div>
                        </div>
                    ))}

                    {/* Order Summary Box */}
                    <div className="order-summary">
                        <div className="order-summary-row">
                            <span>Items in Order</span>
                            <span>{order.totalItems}</span>
                        </div>
                        <hr className="order-inner-divider" />
                        <div className="order-summary-row order-total-row">
                            <span>Total</span>
                            <span className="order-total-amount">
                                ₹{order.totalPrice.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default MyOrders