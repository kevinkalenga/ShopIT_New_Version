import mongoose from "mongoose";
import Product from "../models/productModel.js";
import products from "./data.js"
const seedProduct = async () => {
    try {

        await mongoose.connect("mongodb+srv://kalenga10:kalenga10@shopit.ondqf3h.mongodb.net/ShopiIT_New_Version?retryWrites=true&w=majority&appName=shopIT");
        await Product.deleteMany();

        console.log("Product are deleted")

        await Product.insertMany(products);
        console.log("Product are added")

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}

seedProduct()