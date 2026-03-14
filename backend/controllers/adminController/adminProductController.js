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

    if (!title || !description || !price || !category || !stock) {
        res.status(400)
        throw new Error("All fields are required")
    }

    const image = req.file?.path

    if (!image) {
        res.status(400)
        throw new Error("Image is required")
    }

    const product = await Product.create({ title, description, price: Number(price), image, category, stock: Number(stock) })

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

    if (!title && !description && !price && !category && stock === undefined && !req.file) {
        res.status(400)
        throw new Error("Please provide at least one field to update")
    }

    product.title = title ?? product.title
    product.description = description ?? product.description
    product.price = price !== undefined ? Number(price) : product.price
    product.image = req.file?.path ?? product.image
    product.category = category ?? product.category
    product.stock = stock !== undefined ? Number(stock) : product.stock

    const updated = await product.save()
    res.status(200).json(updated)
})


//soft delete
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false })

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    product.isDeleted = true
    await product.save()

    res.status(200).json({ message: "Product deleted successfully" })

})