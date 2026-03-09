import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDb from "./config/db.js"

import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

dotenv.config()

const app = express()

//Connect Database
connectDb()

app.use(express.json())


app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

//Test Route
app.get("/", (req, res) => {
    res.send("API is Working")
})

//Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})