import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addToCart, decreaseCartQuantity, getCart, removeCartItem } from "../controllers/cartController.js"

const router = express.Router()

router.post("/", protect, addToCart)
router.get("/", protect, getCart)
router.delete("/:productId", protect, removeCartItem)
router.patch("/:productId/decrease", protect, decreaseCartQuantity)

export default router