import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/User.js"

export const protect = asyncHandler(async (req, res, next) => {

  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    try {

      token = req.headers.authorization.split(" ")[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        res.status(401)
        throw new Error("User not found")
      }

      if (user.isBlocked) {
        res.status(403)
        throw new Error("User is blocked by admin")
      }

      req.user = user
      next()

    } catch (error) {
      res.status(401)
      throw new Error("Not authorized, token failed")
    }

  } else {
    res.status(401)
    throw new Error("Not authorized, no token")
  }

})


export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403)
    throw new Error("Admin access only")
  }
}
