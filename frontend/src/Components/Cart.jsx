import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import apiClient from "../api/apiClient"
import { useCart } from "../Context/cartContext"
import "./Cart.css"

function Cart() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()
  const { refreshCartCount } = useCart()

  const fetchCart = async () => {
    try {
      const res = await apiClient.get('/cart')
      setCart(res.data.items || [])
    } catch (err) {
      console.error("Cart error:", err.response?.data)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const increaseQty = async (productId) => {
    await apiClient.post('/cart', { productId, quantity: 1 })
    fetchCart()
    refreshCartCount()
  }

  const decreaseQty = async (productId) => {
    await apiClient.patch(`/cart/${productId}/decrease`)
    fetchCart()
    refreshCartCount()
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + ((item.productId?.price || 0) * item.quantity)
    }, 0)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p className="cart-empty-text">Your cart is empty</p>
          <Link to="/products" className="cart-empty-button">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => {
              if (!item.productId) return null
              return (
                <div key={item.productId._id} className="cart-item">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.productId.title}</h4>
                    <p className="cart-item-price">
                      ₹{Number(item.productId.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-quantity-controls">
                      <button
                        onClick={() => decreaseQty(item.productId._id)}
                        className="cart-qty-button"
                      >−</button>
                      <span className="cart-quantity">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.productId._id)}
                        className="cart-qty-button"
                      >+</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Items in Cart</span>
              <span className="cart-summary-value">{totalItems}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span className="cart-summary-label">Total</span>
              <span className="cart-summary-value">
                ₹{calculateTotal().toLocaleString('en-IN')}
              </span>
            </div>
            <button
              className="cart-checkout-button"
              onClick={() => navigate('/buy-now')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart