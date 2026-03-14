import React, { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../Context/cartContext"
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const { cartCount, refreshCartCount } = useCart()
  const profileRef = useRef()

  useEffect(() => {
    const username = localStorage.getItem("username")
    const email = localStorage.getItem("email")
    if (username) {
      setUser({ username, email })
    }
  }, [])

  useEffect(() => {
    refreshCartCount()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">Tymist</Link>

      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-link">
          Cart
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>
        <Link to="/my-orders">My Orders</Link>


        {user ? (
          <div className="profile-wrapper" ref={profileRef}>
            <button
              className="profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              Profile ▾
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <p className="profile-name">{user.username}</p>
                <p className="profile-email">{user.email}</p>
                <hr />
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar