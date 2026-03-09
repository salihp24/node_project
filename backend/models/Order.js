import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },

                name: String,
                price: Number,
                quantity: Number,
                image: String,
            },
        ],

        totalPrice: {
            type: Number,
            required: true,
        },

        totalItems: {
            type: Number,
            required: true,
        },

        orderId: {
            type: String,
        },

        purchaseDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;