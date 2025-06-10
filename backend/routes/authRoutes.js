import express from "express";
const router = express.Router();
import {authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js"
import {
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile, 
    updatePassword, 
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser, 
    deleteUser
} from "../controllers/authController.js";


// pwd
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

// Auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// User Info
router.route("/me").get(isAuthenticatedUser, getUserProfile)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)

// Admin routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route("/admin/users/:id")
      .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
      .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
      .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

export default router