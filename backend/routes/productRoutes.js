import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { deleteProduct, getProductDetails, getProducts, newProduct, updateProduct } from '../controllers/productControllers.js';
const router = express.Router()

router.route("/products").get(isAuthenticatedUser, getProducts);
router.route("/admin/products").post(newProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;