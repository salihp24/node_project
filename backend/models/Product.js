import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
        },

        image: {
            type: String,
        },

        category: {
            type: String,
            required: true,
        },
        
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;