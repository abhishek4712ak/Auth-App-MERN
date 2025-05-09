import express from "express";
import { register, login, logout , verifyEmail, sendVerifyOtp, isAuthenticated, sendResetPasswordOtp, resetPassword} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify-email", authMiddleware, verifyEmail);
authRouter.post("/send-verify-otp",authMiddleware, sendVerifyOtp);
authRouter.post("/is-auth", isAuthenticated);
authRouter.post("/send-reset-otp", sendResetPasswordOtp);
authRouter.post("/reset-password", resetPassword);


export default authRouter;
