import express from "express"
import {protect} from "../../middleware/authMiddleware.js"
import { admin } from "../../middleware/authMiddleware.js"
import { deleteUser, getSingleUser, getUsers, updateUserBlockStatus } from "../../controllers/adminController/adminUserController.js"

const router=express.Router()

router.get("/", protect, admin, getUsers)
router.patch("/:id/block-status", protect, admin, updateUserBlockStatus)
router.get("/:id", protect, admin, getSingleUser)
router.delete("/:id", protect, admin, deleteUser)

export default router