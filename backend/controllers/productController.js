import asyncHandler from "express-async-handler"
import Product from "../models/Product.js"


//all products or categorty
export const getProducts = asyncHandler(async (req, res) => {

    const {category, keyword} = req.query

    let filter = {}

    if (category) {
        filter.category = { $regex: category, $options: "i" }
    }

    if(keyword){
        filter.name={$regex:keyword, $options:"i"}
    }

    const products = await Product.find(filter)

    res.json(products)

})


//single product
export const getProductById = asyncHandler(async (req,res)=>{

    const product = await Product.findById(req.params.id)

    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error("Product not found")
    }

})