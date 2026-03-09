import Navbar from "../Pages/Navbar";
import { Outlet } from "react-router-dom";

import React from 'react'
import Footer from "../Pages/Footer";

function Layout() {
  return (
    <>
    <Navbar/>
    <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
      <Footer/>
    </>
  )
}

export default Layout