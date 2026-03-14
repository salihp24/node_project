import asyncHandler from "express-async-handler"
import User from "../../models/User.js"
import generateToken from "../../utils/generateToken.js"

export const adminLogin = asyncHandler(async (req, res) => {

  const { email, password } = req.body

  const admin = await User.findOne({ email, role: "admin" })

  if (!admin) {
    res.status(401)
    throw new Error("Admin not found")
  }

  if (await admin.matchPassword(password)) {

    res.json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id)
    })

  } else {
    res.status(401)
    throw new Error("Invalid credentials")
  }

})
