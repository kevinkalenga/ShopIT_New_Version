import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order => /api/v1/orders/new 
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    // get the detail from the body
    const {
        orderItem,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;
    
    // create the order
    const order = await Order.create({
        orderItem,
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
    })
}); 

// Get order details => /api/v1/orders/:id

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    // populate so as to get the info of the user in the detail for the frontend
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

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