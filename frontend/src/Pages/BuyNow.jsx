import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "./BuyNow.css"

function BuyNow() {
    const {id}=useParams()
    const [product, setProduct]=useState(null)
    const [cartItems,setCartItems]=useState([])

    const [address,setAddress]=useState({
      name:"",
      addres:"",
      city:"",
      pincode:""
    })
    const [payment, setPayment]=useState("")
    const [cardDetails, setCardDetails] = useState({cardOrUpi: ""})

    useEffect(()=>{
        const userId=localStorage.getItem("userId")

        if(id){
          axios.get(`http://localhost:3001/products/${id}`)
          .then(res=>setProduct(res.data))
          .catch(err=>console.log("Failed to fetch product", err))
        }else{
          axios.get(`http://localhost:3001/cart?userId=${userId}`)
          .then(res=>setCartItems(res.data))
          .catch(err=>console.log("Failed to fetch cart", err))
        }
    }, [id])

    if(id && !product) return <p>Loading...</p>
    if(!id && cartItems.length===0) return <p style={{color:"white"}}>No Products</p>

    const handlePlaceOrder = async () => {
  const userId = localStorage.getItem("userId")
  if (!userId) {
    alert("User not logged in")
    return
  }

  if (
    !address.name ||
    !address.addres ||
    !address.city ||
    !address.pincode
  ) {
    alert("Please fill all address fields")
    return
  }

  if (!payment) {
    alert("Please select a payment method")
    return
  }

  if (payment === "CARD" && !cardDetails.cardOrUpi) {
    alert("Please Enter Card or UPI Details")
    return
  }

  try {
    
    const userRes = await axios.get(
      `http://localhost:3001/users/${userId}`
    )
    const user = userRes.data

    
    const items = id
      ? [{
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1
        }]
      : cartItems.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        }))

    
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price.replace(/,/g, ""))
      return sum + price * item.quantity
    }, 0)

    
    const order = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items,
      totalAmount,
      paymentMethod: payment,
      paymentStatus: "Paid",
      address,
      createdAt: new Date().toISOString()
    }

    
    await axios.post("http://localhost:3001/orders", order)

    
    if (!id) {
      await Promise.all(
        cartItems.map(item =>
          axios.delete(`http://localhost:3001/cart/${item.id}`)
        )
      )
      setCartItems([])
    }

    alert("Order placed successfully!")
  } catch (err) {
    console.error("Order failed:", err)
    alert("Failed to place order")
  }
}


  return (
    <div className="checkout-wrapper">
      <h2 className="checkout-heading">Complete Your Order</h2>

      <div className="checkout-grid">
        
        
        {id && product && (
          <div className="product-display">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <h4>{product.price}</h4>
          </div>
        )}

        
        {!id && (
          <div className="cart-items-display">
            {cartItems.map(item => (
              <div key={item.id} className="cart-single-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div>
                  <h3>{item.title}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

       
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
              value={address.addres}
              onChange={(e) => setAddress({ ...address, addres: e.target.value })}
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
                value={cardDetails.cardOrUpi}
                onChange={(e) => setCardDetails({ cardOrUpi: e.target.value })}
                className="text-input"
              />
            </div>
          )}

          <button className="order-button" onClick={handlePlaceOrder}>
            Confirm Order
          </button>
        </div>

      </div>
    </div>
  )
}

export default BuyNow