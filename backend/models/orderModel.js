import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    //   the user that has created the order
    user: {
        type:  mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    // An array of what the user has purchased
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true
            },
            price: {
                 type: Number,
                required: true,
            },
            product: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Product",
            },
        }
    ],
    paymentMethod: {
        type: String,
        required: [true, 'Please select payment method'],
        enum: {
            values: ["COD", "Card"],
            message: "Please select: COD or Card"
        }
    },
    paymentInfo: {
        id: String,
        status: String,
    },
    itemsPrice: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        required: true
    },
    shippingAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: {
            values: ["Processing", "Shipped", "Delivered"],
            message: "Please select correct order status"
        },
        default: "Processing",
    },
    deliveredAt: Date

},
    {
        timestamps: true,
    })

const Order = mongoose.model("Order", orderSchema);

export default Order;