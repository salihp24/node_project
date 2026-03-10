import asyncHandler from "express-async-handler"
import User from "../../models/user.js" 
import Order from "../../models/Order.js" 

//View users
export const getUsers=asyncHandler(async(req,res)=>{
    const users= await User.find({isDeleted:false}).select("-password")
    res.status(200).json(users)
})

//view single user and his orders
export const getSingleUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select("-password")

    if(!user){
        res.status(404)
        throw new Error("User not found")
    }

    const orders=await Order.find({userId:user._id}).populate("products.productId")

    res.status(200)
    .json({user, orders})
})