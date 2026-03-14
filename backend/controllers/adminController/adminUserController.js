import asyncHandler from "express-async-handler"
import User from "../../models/User.js"
import Order from "../../models/Order.js"

//View users
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isDeleted: false }).select("-password")
    res.status(200).json(users)
})

//view single user and his orders
export const getSingleUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select("-password")


    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }

    const orders = await Order.find({ userId: user._id }).populate("products.productId")

    res.status(200)
        .json({ user, 
            orders })
})

//Block user
export const updateUserBlockStatus = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id,
        { isBlocked: req.body.isBlocked },
        { new: true }
    )

    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }

    res.status(200).json({
        message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully"
    })
})


//Delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true })


    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }

    res.status(200).json({ message: "User deleted successfully" })
})
