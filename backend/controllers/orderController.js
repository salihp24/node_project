import asyncHandler from "express-async-handler"
import Order from "../models/Order.js"
import Cart from "../models/Cart.js"

export const createOrder = asyncHandler(async (req,res)=>{

    const cart = await Cart.findOne({ userId:req.user._id })
        .populate("items.productId")

    if(!cart || cart.items.length === 0){
        res.status(400)
        throw new Error("Cart is empty")
    }

    let totalPrice = 0
    let totalItems = 0

    const products = cart.items.map(item => {

        totalPrice += item.productId.price * item.quantity
        totalItems += item.quantity

        return {
            productId: item.productId._id,
            name: item.productId.title,
            price: item.productId.price,
            quantity: item.quantity,
            image: item.productId.image
        }

    })

    const order = await Order.create({
        userId: req.user._id,
        products,
        totalPrice,
        totalItems
    })

    cart.items = []
    await cart.save()

    res.status(201).json(order)

})


//Get aal orders
export const getMyOrders = asyncHandler(async (req,res)=>{
    const orders = await Order.find({ userId:req.user._id })
    res.json(orders)
})