import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

//Total products purchased + total revenue
export const getStats=asyncHandler(async(req,res)=>{
    const orders=await Order.find()

    const totalRevenue=orders.reduce((sum,O)=>sum+O.totalPrice, 0)
    const totalProductsPurchased=orders.reduce((sum,o)=>sum+o.totalItems, 0)
    const totalOrders= orders.length

    res.json({totalOrders, totalProductsPurchased, totalRevenue})
})