import { Routes, Route, Navigate } from "react-router-dom"

import Register from "./Pages/Register"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import Layout from "./Components/Layout"
import Products from "./Pages/Products"
import ProductDetails from "./Components/ProductDetails"
import Cart from "./Components/Cart"
import BuyNow from "./Pages/BuyNow"


import AdminLogin from "./Admin/AdminLogin"
import AdminDashboard from "./Admin/AdminDashboard"
import AdminLayout from "./Admin/AdminLayout"
import AdminProtect from "./Admin/AdminProtect"
import AdminProducts from "./Admin/AdminProducts"
import AdminUsers from "./Admin/AdminUsers"
import AdminOrders from "./Admin/AdminOrders"
import UserProtect from "./Components/userProtect"
import MyOrders from "./Pages/my-orders"

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/home" replace />} />


      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />


      <Route element={<Layout />}>
        {/* Public pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Protected user pages */}
        <Route element={<UserProtect />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/buy-now" element={<BuyNow />} />
          <Route path="/buy-now/:id" element={<BuyNow />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>
      </Route>


      <Route path="/admin/login" element={<AdminLogin />} />


      <Route
        path="/admin"
        element={
          <AdminProtect>
            <AdminLayout />
          </AdminProtect>
        }
      >

        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  )
}

export default App
