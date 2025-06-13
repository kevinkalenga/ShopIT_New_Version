import express from 'express';
import { isAuthenticatedUser,  authorizeRoles } from '../middlewares/auth.js';
import { deleteProduct, getProductDetails, getProducts, newProduct, updateProduct, createProductReview} from '../controllers/productControllers.js';
const router = express.Router()

router.route("/products").get(getProducts);
router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.route("/products/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router
    .route("/reviews").put(isAuthenticatedUser, createProductReview)

export default router;