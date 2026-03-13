import asyncHandler from "express-async-handler"
import Cart from "../models/Cart.js"

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body
    const userId = req.user._id

    let cart = await Cart.findOne({ userId })

    if (!cart) {
        cart = await Cart.create({
            userId,
            items: [{ productId, quantity }]
        })
    } else {
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        )

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity
        } else {
            cart.items.push({ productId, quantity })
        }

        await cart.save()
    }
    res.status(200).json(cart)
})


//Decrease Quantity

export const decreaseCartQuantity = asyncHandler(async (req, res) => {

    const productId = req.params.productId
    const userId = req.user._id

    const cart = await Cart.findOne({ userId })

    if (!cart) {
        res.status(404)
        throw new Error("Cart not found")
    }

    const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
    )

    if (itemIndex === -1) {
        res.status(404)
        throw new Error("Product not found in cart")
    }

    // decrease quantity
    cart.items[itemIndex].quantity -= 1

    // remove if quantity becomes 0
    if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1)
    }

    await cart.save()

    res.json(cart)

})

//Get cart of the user 
export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id })
        .populate("items.productId")

    if (!cart) {
        return res.json({
            items: [],
            message: "Cart is empty"
        })
    }

    res.json(cart)
})


//Remove Cart item
export const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id })

    cart.items = cart.items.filter(items => items.productId.toString() !== req.params.productId)

    await cart.save()

    res.json(cart)
})

