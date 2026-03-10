import asyncHandler from "express-async-handler"
import Order from "../../models/Order.js"

//All orderss
export const getAllOrders=asyncHandler(async(req,res)=>{
    const orders=await Order.find().populate("userId", "username email")

    res.status(200)
    .json(orders)
})

