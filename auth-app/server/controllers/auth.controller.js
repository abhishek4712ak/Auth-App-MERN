import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../config/nodemailer.js";

dotenv.config();

// Register a user

export const register = async (req, res) => {
    // Get the data from the request body
    const {name, email, password} = req.body;
    console.log('req.body:', req.body);

    try {
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const user = new User({name, email, password: hashedPassword});
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({userId: user._id}, process.env.JWT_KEY, {expiresIn: "1h"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000});

        // Send a welcome email to the user
        const mailOptions = {
            from: "abhishek4712ak@gmail.com",
            to: email,
            subject: "Welcome to our app",
            text: `Welcome to our website.
            Your account has been created with email id : ${email}`
        };

        // Send the email
         const result = await transporter.sendMail(mailOptions);
         console.log(result);

        // Send the response
        res.json({success: true, message: "User registered successfully"});

        
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Login a user

export const login = async (req, res) => {
    // Get the data from the request body
    const {email, password} = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.json({success: false, message: "Email and password are required"});
    }

    try {
        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.json({success: false, message: "Invalid password"});
        }
        
        // Generate a JWT token
        const token = jwt.sign({userId: user._id}, process.env.JWT_KEY, {expiresIn: "1h"});

        // Set the token in the cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({success: true, message: "Login successful",
            userId: user._id,
            email: user.email,
            name: user.name
        });
        
    } catch (error) {
        res.json({success: false, message: error.message});
    }
    
    
}

// Logout a user

export const logout = async (req, res) => {
    try {
        res.clearCookie("token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.json({success: true, message: "User logged out successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Send a verify OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        // Get the user id from the request body
        const {userId} = req.body;
        console.log(userId);

        if (!userId) {
            return res.json({success: false, message: "User ID is required"});
        }

        const user = await User.findById(userId);
        
        // Add check for user existence
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        // Check if the user is already verified
        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"});
        }
        
        // Generate a 6 digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        console.log(otp);

        // Send the OTP to the user's email
        const mailOptions = {
            from: "abhishek4712ak@gmail.com",
            to: user.email,
            subject: "Verify your account",
            text: `Your OTP for verification is ${otp}.
            verify your account using this OTP `
        };
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: "OTP sent to the user's email"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


// Verify the OTP
export const verifyEmail = async (req, res) => {
    // Get the user id and the OTP from the request body
    const {userId,otp} = req.body;
    if(!userId || !otp){
        return res.json({success: false, message: "User ID and OTP are required"});
    }

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        // Check if the OTP is correct
        if(user.verifyOtp === null || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        // Check if the OTP has expired
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"});
        }

        // Verify the user's email
        user.isAccountVerified = true;
        user.verifyOtp = null;
        user.verifyOtpExpireAt = null;
        await user.save();

        // Send the response
        res.json({success: true, message: "Email verified successfully"});

        //send a welcome email to the user
        const mailOptions = {
            from: "abhishek4712ak@gmail.com",
            to: user.email,
            subject: "Welcome to our app",
            text: `Welcome to our website.
            Your account has been verified with email id : ${user.email}`
        };
        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent to the user");
    }
    catch (error) {
        res.json({success: false, message: error.message});
    }
}


//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true, message: "User is authenticated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


//send a reset password otp to the user's email  
export const sendResetPasswordOtp = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.json({success: false, message: "Email is required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        // Generate a 6 digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        // Send the OTP to the user's email
        const mailOptions = {
            from: "abhishek4712ak@gmail.com",
            to: user.email,
            subject: "Reset your password",
            text: `Your OTP for resetting your password is ${otp}.
            reset your password using this OTP `
        };
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: "OTP sent to the user's email"});

    
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


//Reset the password
export const resetPassword = async (req, res) => {
    const {otp, newPassword} = req.body;
    if(!otp || !newPassword){
        return res.json({success: false, message: "OTP and new password are required"});
    }

    try {
        const user = await User.findOne({resetOtp: otp});

        // Check if the user exists
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        // Check if the OTP is correct
        if(user.resetOtp === null || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        // Check if the OTP has expired
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"});
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpireAt = null;
        await user.save();

        res.json({success: true, message: "Password reset successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}