import express from "express"
import {Protect} from "../../middleware/authMiddleware.js"
import { admin } from "../../middleware/adminMiddleware.js"

const router=express.Router()

