import express from "express"
import { protect } from "../../middleware/authMiddleware.js"
import { admin } from "../../middleware/authMiddleware.js"
import { getStats } from "../../controllers/adminController/adminStatsController.js"

const router = express.Router()

router.get("/", protect, admin, getStats)

export default router