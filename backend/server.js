import express from "express"
import "./config/env.js"

import cors from "cors"
import connectDb from "./config/db.js"

import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"


import adminUserRoutes from "./routes/adminRoutes/adminUserRoutes.js"
import adminProductRoutes from "./routes/adminRoutes/adminProductRoutes.js"
import adminOrderRoutes from "./routes/adminRoutes/adminOrderRoutes.js"
import adminStatsRoutes from "./routes/adminRoutes/adminStatsRoutes.js"


const app = express()

//Connect Database
connectDb()

app.use(express.json())

//User Routess
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)


//Admin Routes
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/admin/products", adminProductRoutes)
app.use("/api/admin/orders", adminOrderRoutes)
app.use("/api/admin/dashboard", adminStatsRoutes )



//Test Route
app.get("/", (req, res) => {
    res.send("API is Working")
})

//Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})