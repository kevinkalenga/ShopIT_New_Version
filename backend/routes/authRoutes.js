import express from "express";
const router = express.Router();
import {isAuthenticatedUser } from "../middlewares/auth.js"
import {registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword} from "../controllers/authController.js";


// pwd
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

// Auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// User Info
router.route("/me").get(isAuthenticatedUser, getUserProfile)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)

export default router