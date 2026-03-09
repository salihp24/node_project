import asyncHandler from "express-async-handler"
import User from "../models/user.js"
import Product from "../models/Product.js"
import Order from "../models/Order.js"

//View users
export const getUsers=asyncHandler(async(req,res)=>{
    const users= await User.find({isDeleted:false}).select("-password")
    res.json(users)
})

//view single user and his orders
export const getSingleUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select("-password")

    if(!user){
        res.status(404)
        throw new Error("User not found")
    }

    const orders=await Order.find({userId:req.params.id})

    res.json({user, orders})
})

//View all products
export const adminGetProducts=asyncHandler(async(req,res)=>{
    const {category}=req.query

    const filter=category?{category:{$regex:category, $options:"i"}} : {}

    const products=await Product.find(filter)
    res.json(products)
})

//View specific product
export const adminGetProductById=asyncHandler(async(req,res)=>{
    const product=await Product.findById(req.params.id)

    if(!product){
        res.status(404)
        throw new Error("Product not found")
    }

    res.json(product)
})


//Create a product
