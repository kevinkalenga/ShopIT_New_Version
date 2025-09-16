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

// export const updateOrder = catchAsyncErrors(async (req, res, next) => {

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//         return next(new ErrorHandler("No order found with this ID", 404));
//     }

//     if (order?.orderStatus === "Delivered") {
//         return next(new ErrorHandler("You have already delivered this order", 400))
//     }

//     let productNotFound = false

//     // Update products stock
//     for(const item of order.orderItems) {
//         const product = await Product.findById(item?.product?.toString())
//         if (!product) {
//             productNotFound = true;
//             break
//         }
//         product.stock = product.stock - item.quantity
//         await product.save({ validateBeforeSave: false })
//     }

//     if (productNotFound) {
//         return next(new ErrorHandler("No product found with one or more IDs", 404));
//     }

//     order.orderStatus = req.body.status;
//     order.deliveredAt = Date.now()

//     await order.save();


//     res.status(200).json({
//         success: true,
//     })
// });

export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You have already delivered this order", 400)
    );
  }

  // Met à jour le stock des produits
  for (const item of order.orderItems) {
    const product = await Product.findById(item?.product?.toString());

    if (!product) {
      return next(
        new ErrorHandler(
          "No product found with ID: " + item?.product,
          404
        )
      );
    }

    product.stock -= item.quantity;

    await product.save({ validateBeforeSave: false });
  }

  // Mets à jour le statut de la commande
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
  });
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


// Get Sales Data => /api/v1/admin/get_sales

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      // Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        }
      }
    },
    {
      // Group data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        totalSales: { $sum: "$totalAmount" },
        numOrder: { $sum: 1 }   // ✅ counts number of orders
      }
    },
    {
      // Optional: sort by date ascending
      $sort: { "_id.date": 1 }
    }
  ]);

  console.log(salesData);
  return salesData;





}


// Helper → generate date range
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}





// ----------------- GET SALES ENDPOINT -----------------
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  // Récupère les ventes depuis MongoDB
  const salesData = await getSalesData(startDate, endDate);

  // Générer toutes les dates du range
  const allDates = getDatesBetween(startDate, endDate);

  // Compléter les dates manquantes
  const finalSalesData = allDates.map((date) => {
    const found = salesData.find((s) => s._id.date === date);
    return found ? found : { _id: { date }, totalSales: 0, numOrder: 0 };
  });

  console.log("Final salesData:", finalSalesData);


  // Totalisation
  const totalSales = finalSalesData.reduce((acc, cur) => acc + cur.totalSales, 0);
  const totalOrders = finalSalesData.reduce((acc, cur) => acc + cur.numOrder, 0);

  res.status(200).json({
    success: true,
    salesData: finalSalesData,
    totalSales,
    totalOrders,
  });
});

