
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/userModel.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto"
// Register user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
    });

     sendToken(user, 201, res)
})

// Login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    // Find user in the database and select the pwd so as to compare  
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    //  check if password is correct
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 200, res)
})

// Logout user => /api/v1/logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        message: "Logged Out",
    })
})



// Forgot password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {


    // Find user in the database  
    const user = await User.findOne({ email: req.body.email })


    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken()

    await user.save();

    // Create reset password url 
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`

    const message = getResetPasswordTemplate(user?.name, resetUrl)

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIT Password Recovery",
            message,
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`
        })
        return;

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()
        return next(new ErrorHandler(error?.message, 500))
    }


})

// Reset password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {

    //  Hash the URL Token 
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords does not match', 400))
    }

    // Set the new password
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    sendToken(user, 200, res)


})

// Get current user profile => /api/v1/me 

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id)

    res.status(200).json({
        user,
    })
}) 






// Update Password => /api/v1/password/update

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    // select the password which is false so as to get it from our userModel
    const user = await User.findById(req?.user?._id).select("+password")

    // check the previous user password 
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old Password is incorrect', 400))
    }

    user.password = req.body.password;
    user.save()

    res.status(200).json({
        success: true,
    })
})