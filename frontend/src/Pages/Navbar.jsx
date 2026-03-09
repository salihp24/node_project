import React, { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const profileRef = useRef()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    axios
      .get(`http://localhost:3001/users/${userId}`)
      .then(res => {
        if (res.data.isBlocked) {
          localStorage.clear()
          navigate("/login")
        } else {
          setUser(res.data)
        }
      })
  }, [navigate])

  useEffect(() => {
  const userId = localStorage.getItem("userId")
  if (!userId) {
    setCartCount(0)
    return
  }

  axios
    .get(`http://localhost:3001/cart?userId=${userId}`)
    .then(res => {
      const count = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      setCartCount(count)
    })
    .catch(() => setCartCount(0))
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
                <p className="profile-name">{user.name}</p>
                <p className="profile-email">{user.email}</p>

                <hr />

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
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
