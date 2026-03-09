import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminLogin.css"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    if (email === "admin@gmail.com" && pass === "Admin@10") {

      
      sessionStorage.setItem("adminAuth", "true")
      sessionStorage.setItem("adminRole", "admin")

      navigate("/admin/dashboard", { replace: true })
    } else {
      alert("Credentials Are Not Matching")
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
