
import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   name: {
        type: String,
        required: true,
    },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true }); 




const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        max: [99999, "Product price cannot exceed 5 digits"], // ✅ Correct use of `max` for numbers
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Sports",
                "Outdoor",
                "Home"
            ],
            message: "Please select a correct category",
        },
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
    },
    numOfReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    reviews: [reviewSchema],

    // reviews: [
    //     {
    //         user: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "User",
    //             required: true,
    //         },
    //         rating: {
    //             type: Number,
    //             required: true,
    //         },
    //         comment: {
    //             type: String,
    //             required: true,
    //         },
    //         createdAt: { type: Date, default: Date.now }
    //     }
    //  ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

export default Product;