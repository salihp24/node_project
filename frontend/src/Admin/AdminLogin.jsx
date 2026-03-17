import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../api/apiClient"
import "./AdminLogin.css"

function AdminLogin() {

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {

      const res = await apiClient.post("/admin/login", {
        email,
        password: pass
      })

      const data = res.data

      localStorage.clear()                       
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      navigate("/admin/dashboard", { replace: true })

    } catch (error) {
      alert(error.response?.data?.message || "Invalid admin credentials")
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">

        <h2>Admin Login</h2>

        <form onSubmit={handleLogin} className="admin-login-form">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="admin-input"
            autoComplete="current-password"
          />

          <button type="submit" className="admin-login-btn">
            Access Dashboard
          </button>

        </form>

      </div>
    </div>
  )
}

export default AdminLogin