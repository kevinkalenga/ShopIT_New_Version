import express from "express";
const router = express.Router();
import {isAuthenticatedUser } from "../middlewares/auth.js"
import {registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile} from "../controllers/authController.js";



router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserProfile)

export default router