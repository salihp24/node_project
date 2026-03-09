import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./Cart.css"

function Cart() {
  const [cart, setCart] = useState([])
  const navigate=useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    const res = await axios.get(`http://localhost:3001/cart?userId=${userId}`)
    setCart(res.data)
  }

  const increaseQty = async (id, quantity) => {
    await axios.patch(`http://localhost:3001/cart/${id}`, {
      quantity: quantity + 1
    })
    fetchCart()
  }

  const decreaseQty = async (id, quantity) => {
    if (quantity === 1) {
      await axios.delete(`http://localhost:3001/cart/${id}`)
    } else {
      await axios.patch(`http://localhost:3001/cart/${id}`, {
        quantity: quantity - 1
      })
    }
    fetchCart()
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/,/g, ''))
      return total + (price * item.quantity)
    }, 0)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout=()=>{
    navigate("/buy-now")
  }

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
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="cart-item-image"
                />
                
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <p className="cart-item-price">{item.price}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button 
                      onClick={() => decreaseQty(item.id, item.quantity)}
                      className="cart-qty-button"
                    >
                      −
                    </button>
                    <span className="cart-quantity">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQty(item.id, item.quantity)}
                      className="cart-qty-button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <button className="cart-checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart