import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/productModel.js";





//Create new Order => /api/v1/orders/new 
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    console.log("BODY REÇU :", req.body);
    console.log("Utilisateur connecté :", req.user._id);
    console.log("User dans newOrder:", req.user);


    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return next(new ErrorHandler("Aucun produit dans la commande", 400));
    }

    
    // ✅ Création de la commande
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    });

    res.status(200).json({
        order,
    });
});


// Get order details => /api/v1/orders/:id

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    // populate so as to get the info of the user in the detail for the frontend
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    ).populate("orderItems.product", "name image price");

    if (!order) {
        return next(new ErrorHandler("No order found with this ID", 404));
    }

    res.status(200).json({
        order,
    })
});
// Get current user orders => /api/v1/me/orders/

export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })



    res.status(200).json({
        orders,
    })
});

// Get all orders - Admin => /api/v1/admin/orders/

export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()



    res.status(200).json({
        orders,
    })
});
// Update orders - Admin => /api/v1/admin/orders/

export const updateOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler("No order found with this ID", 404));
    }

    if (order?.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400))
    }

    // Update products stock
    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString())
        if (!product) {
            return next(new ErrorHandler("No product found with this ID", 404));
        }
        product.stock = product.stock - item.quantity
        await product.save({ validateBeforeSave: false })
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now()

    await order.save();


    res.status(200).json({
        success: true,
    })
});

// Delete order => /api/v1/admin/orders/:id

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("No order found with this ID", 404));
    }

    await order.deleteOne()

    res.status(200).json({
        success: true,
    })
});