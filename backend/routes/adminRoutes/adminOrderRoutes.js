import express from "express"
import {protect} from "../../middleware/authMiddleware.js"
import { admin } from "../../middleware/authMiddleware.js"
import { getAllOrders } from "../../controllers/adminController/adminOrderController.js"

const router=express.Router()

router.get("/", protect, admin, getAllOrders)

export default router
