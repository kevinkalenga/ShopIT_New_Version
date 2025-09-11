import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilter.js";

// Get all the products /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
    
    
    const resPerPage = 4;

    // Récupérer les valeurs des filtres directement dans req.query
    const priceGte = req.query['price[gte]'] ? Number(req.query['price[gte]']) : undefined;
    const priceLte = req.query['price[lte]'] ? Number(req.query['price[lte]']) : undefined;
    const keyword = req.query.keyword || undefined;
    const page = Number(req.query.page) || 1;

    // Construire le filtre
    const filter = {};

    if (priceGte !== undefined || priceLte !== undefined) {
        filter.price = {};
        if (priceGte !== undefined) filter.price.$gte = priceGte;
        if (priceLte !== undefined) filter.price.$lte = priceLte;
    }

    if (keyword) {
        filter.name = { $regex: keyword, $options: 'i' };
    }

    // Ratings
     if (req.query.ratings) {
         filter.ratings = { $gte: Number(req.query.ratings) };
      }

    // Chercher les produits filtrés
    const totalProducts = await Product.find(filter);
    const filteredProductsCount = totalProducts.length;

    const products = await Product.find(filter)
        .limit(resPerPage)
        .skip(resPerPage * (page - 1));

    return res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
    
    
    
   
})

// Create new Product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async(req, res) => {
    // to save the id of the user for creating the product
     req.body.user = req.user._id
    const product = await Product.create(req.body)
    res.status(200).json({
        product
    })
})

// Get single product details => /api/v1/products/:id 
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params.id).populate({ path: 'reviews.user', select: 'name avatar' });
    
    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        product,
    })
})
// Update product => /api/v1/products/:id 
export const updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true });
    
    if(!product) {
         return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        product,
    })
})
// Delete product => /api/v1/products/:id 
export const deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req?.params?.id);
    
    if(!product) {
         return next(new ErrorHandler("Product not found", 404))
    }
    
    await product.deleteOne()
    res.status(200).json({
        message: "Product Deleted",
    })
})

// Create/Update product review => /api/v1/reviews
// export const createProductReview = catchAsyncErrors(async (req, res, next) => {
//     const { rating, comment } = req.body;
//     const productId = req.params.id; // ← important !

//     const review = {
//         user: req.user._id,
//         rating: Number(rating),
//         comment,
//     };

//     const product = await Product.findById(productId);
//     if (!product) return next(new ErrorHandler("Product not found", 404));

//     const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

//     if (isReviewed) {
//         product.reviews.forEach(r => {
//             if (r.user.toString() === req.user._id.toString()) {
//                 r.comment = comment;
//                 r.rating = rating;
//             }
//         });
//     } else {
//         product.reviews.push(review);
//         product.numOfReviews = product.reviews.length;
//     }

//     product.ratings = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

//     await product.save({ validateBeforeSave: false });

//     res.status(201).json({
//         success: true,
//         product, // ⚡ contient ratings, numOfReviews et reviews à jour
//         message: "Review added successfully"
//     });
// });

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach(r => {
      if (r.user.toString() === req.user._id.toString()) {
        r.comment = comment;
        r.rating = Number(rating);
        r.updatedAt = new Date(); // Met à jour la date
      }
    });
  } else {
    const review = {
    //   name: req.user.name,
      user: req.user._id,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  const populatedProduct = await Product.findById(product._id)
    .populate("reviews.user", "name avatar"); // récupère le nom correctement

  res.status(201).json({
    success: true,
    product: populatedProduct,
    message: "Review added successfully",
  });
});





// Get product reviews => /api/v1/reviews 
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }

    res.status(200).json({
        reviews: product.reviews,
    })

})

// Delete product review => /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    // find the product in the database
    let product = await Product.findById(req.query.productId)



    if (!product) {
        return next(new ErrorHandler("Produc not found", 404))
    }
    // we have a new array of reviews
    const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req?.query?.id.toString()
    )

    // we have the number of reviews
    const numOfReviews = reviews.length


    const ratings =
        numOfReviews === 0 ? 0 :
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews


    product = await Product.findByIdAndUpdate(req.query.productId, { reviews, numOfReviews, ratings }, { new: true })

    res.status(200).json({
        success: true,
        product,
    })
});

// Get products Admin => /api/v1/admin/products/ 
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.find();
    
    res.status(200).json({
        product,
    })
})
