import express from "express"
import { protect } from "../../middleware/authMiddleware.js"
import { admin } from "../../middleware/authMiddleware.js"
import { adminGetProductById, adminGetProducts, createProduct, deleteProduct, updateProduct } from "../../controllers/adminController/adminProductController.js"
import { upload } from "../../config/cloudinary.js"

const router = express.Router()

router.get("/", protect, admin, adminGetProducts)
router.get("/:id", protect, admin, adminGetProductById)
router.post("/", protect, admin, upload.single("image"), createProduct)
router.put("/:id", protect, admin, upload.single("image"), updateProduct)
router.delete("/:id", protect, admin, deleteProduct)

export default router