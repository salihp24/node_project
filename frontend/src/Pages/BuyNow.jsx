import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import "./BuyNow.css"

function BuyNow() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [error, setError] = useState("")

    const [address, setAddress] = useState({
        name: "",
        address: "",
        city: "",
        pincode: ""
    })
    const [payment, setPayment] = useState("")
    const [cardOrUpi, setCardOrUpi] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError("")
            try {
                if (id) {
                    const { data } = await apiClient.get(`/products/${id}`)
                    setProduct(data)
                } else {
                    const { data } = await apiClient.get("/cart")
                    setCartItems(data.items || [])
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const totalAmount = id
        ? product?.price || 0
        : cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)

    const validate = () => {
        if (!address.name || !address.address || !address.city || !address.pincode) {
            setError("Please fill all address fields")
            return false
        }
        if (!payment) {
            setError("Please select a payment method")
            return false
        }
        if (payment === "CARD" && !cardOrUpi.trim()) {
            setError("Please enter card number or UPI ID")
            return false
        }
        return true
    }

    const handlePlaceOrder = async () => {
        setError("")
        if (!validate()) return

        setPlacing(true)
        try {
            if (id) {
                await apiClient.post("/cart", { productId: id, quantity: 1 })
            }

            const { data } = await apiClient.post("/orders")

            alert(`Order placed successfully! Order ID: ${data._id}`)
            navigate("/my-orders")

        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order")
        } finally {
            setPlacing(false)
        }
    }

    if (loading) return <p className="status-msg">Loading...</p>

    if (!id && cartItems.length === 0)
        return <p className="status-msg">Your cart is empty</p>

    if (id && !product)
        return <p className="status-msg">Product not found</p>

    return (
        <div className="checkout-wrapper">
            <h2 className="checkout-heading">Complete Your Order</h2>

            {error && <p className="error-msg">{error}</p>}

            <div className="checkout-grid">

                {/* Single product - Buy Now */}
                {id && product && (
                    <div className="product-display">
                        <img src={product.image} alt={product.title} />
                        <h3>{product.title}</h3>
                        <p>{product.description}</p>
                        <h4>₹{product.price}</h4>
                    </div>
                )}

                {/* Cart items - Checkout */}
                {!id && (
                    <div className="cart-items-display">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-single-item">
                                <img
                                    src={item.productId.image}
                                    alt={item.productId.title}
                                    className="cart-item-image"
                                />
                                <div>
                                    <h3>{item.productId.title}</h3>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>₹{item.productId.price}</p>
                                </div>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Total: ₹{totalAmount}</strong>
                        </div>
                    </div>
                )}

                {/* Address + Payment form */}
                <div className="form-container">

                    <h3 className="section-header">Delivery Address</h3>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            className="text-input"
                        />
                    </div>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Street Address"
                            value={address.address}
                            onChange={(e) => setAddress({ ...address, address: e.target.value })}
                            className="text-input"
                        />
                    </div>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="text-input"
                        />
                    </div>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            className="text-input"
                        />
                    </div>

                    <h3 className="section-header">Payment Method</h3>

                    <div className="payment-methods">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={payment === "COD"}
                                onChange={(e) => setPayment(e.target.value)}
                            />
                            <span>Cash on Delivery</span>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="payment"
                                value="CARD"
                                checked={payment === "CARD"}
                                onChange={(e) => setPayment(e.target.value)}
                            />
                            <span>Card / UPI</span>
                        </label>
                    </div>

                    {payment === "CARD" && (
                        <div className="card-input-area">
                            <input
                                type="text"
                                placeholder="Card Number or UPI ID"
                                value={cardOrUpi}
                                onChange={(e) => setCardOrUpi(e.target.value)}
                                className="text-input"
                            />
                        </div>
                    )}

                    <button
                        className="order-button"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                    >
                        {placing ? "Placing Order..." : "Confirm Order"}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default BuyNow