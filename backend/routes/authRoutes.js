import express from "express";
const router = express.Router();
import {registerUser, loginUser, logoutUser, forgotPassword} from "../controllers/authController.js";



router.route("/password/forgot").post(forgotPassword)
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser)

export default router