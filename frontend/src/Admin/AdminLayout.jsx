import { NavLink, Outlet, useNavigate } from "react-router-dom"
import "./AdminLayout.css"

function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="admin-layout">
      
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  )
}

export default AdminLayout
