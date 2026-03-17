import asyncHandler from "express-async-handler"
import User from "../../models/User.js"
import Order from "../../models/Order.js"

//View users
export const getUsers = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 5 } = req.query

    const filter = { isDeleted: false }

    if (search) {
        filter.$or = [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const totalUsers = await User.countDocuments(filter)
    const users = await User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(Number(limit))

    res.status(200).json({
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / Number(limit)),
        currentPage: Number(page)
    })
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
