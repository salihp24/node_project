import { Navigate } from "react-router-dom"

function AdminProtect({ children }) {
  const adminAuth = sessionStorage.getItem("adminAuth")
  const adminRole = sessionStorage.getItem("adminRole")

  if (!adminAuth || adminRole !== "admin") {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtect
