import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import apiClient from "../api/apiClient"
import axios from "axios"
import "./Login.css"

function Login() {

  const navigate = useNavigate()

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      setError('Please fill the field')
      return
    }
    try {
      const res = await apiClient.post('/users/login', {
        email: user.email,
        password: user.password
      })
      const data = res.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data._id)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', data.username)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }


  return (
    <div className="login-container">

      <h2 className="login-title">Login</h2>

      <input
        className="login-input"
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
      />

      <input
        className="login-input"
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
      />

      {error && <p className="error-message">{error}</p>}

      <button
        className="login-button"
        onClick={handleLogin}
      >
        Login
      </button>

      <p style={{
        marginTop: "12px",
        color: "#83c5be",
        fontSize: "14px",
        textAlign: "center"
      }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#006d77",
            fontWeight: "600",
            textDecoration: "underline"
          }}
        >
          Register
        </Link>
      </p>

    </div>
  )
}

export default Login