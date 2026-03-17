import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

export const getStats = asyncHandler(async (req, res) => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
                totalProductsPurchased: { $sum: "$totalItems" },
                totalOrders: { $sum: 1 }
            }
        }
    ])

    if (stats.length === 0) {
        return res.json({
            totalOrders: 0,
            totalProductsPurchased: 0,
            totalRevenue: 0
        })
    }

    const { totalRevenue, totalProductsPurchased, totalOrders } = stats[0]

    res.json({ totalOrders, totalProductsPurchased, totalRevenue })
})