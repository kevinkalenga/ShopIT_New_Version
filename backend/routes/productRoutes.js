import express from 'express';
import { isAuthenticatedUser,  authorizeRoles } from '../middlewares/auth.js';
import { 
     deleteProduct, 
     getProductDetails, 
     getProducts, 
     newProduct, 
     updateProduct, 
     createProductReview, 
     getProductReviews, deleteReview} from '../controllers/productControllers.js';
const router = express.Router()

router.route("/products").get(getProducts);
router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.route("/products/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

// Reviews d'un produit spécifique
router
    .route("/products/:id/reviews")   // :id correspond au productId
    .get(getProductReviews)           // récupérer toutes les reviews d'un produit
    .post(isAuthenticatedUser, createProductReview);  // créer une review pour un produit

router
    .route("/admin/reviews")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview)


export default router;