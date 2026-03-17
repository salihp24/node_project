import { Navigate } from "react-router-dom"

function AdminProtect({ children }) {

  const adminAuth = localStorage.getItem("token")
  const adminRole = localStorage.getItem("role")

  if (!adminAuth || adminRole !== "admin") {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtect