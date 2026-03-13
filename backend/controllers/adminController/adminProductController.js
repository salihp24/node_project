import asyncHandler from "express-async-handler"
import Product from "../../models/Product.js"


//View all products
export const adminGetProducts = asyncHandler(async (req, res) => {
    const { category } = req.query

    const filter = {
        isDeleted: false,
        ...(category && { category: { $regex: category, $options: "i" } })
    }

    const products = await Product.find(filter)
    res.status(200).json(products)
})

//View specific product
export const adminGetProductById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({
        _id: req.params.id,
        isDeleted: false
    })

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    res.status(200).json(product)
})


//Create a product
export const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category, stock } = req.body

    const image = req.file?.path

    if (!image) {
        res.status(400)
        throw new Error("Image is required")
    }

    const product = await Product.create({ title, description, price, image, category, stock })

    res.status(201).json(product)
})

//update product
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false })

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    const { title, description, price, category, stock } = req.body

    product.title = title ?? product.title
    product.description = description ?? product.description
    product.price = price ?? product.price
    product.image = req.file?.path ?? product.image
    product.category = category ?? product.category
    product.stock = stock ?? product.stock

    const updated = await product.save()
    res.status(200).json(updated)
})


//soft delete
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    product.isDeleted = true
    await product.save()

    res.json({
        message: "Product Deleted"
    })
})