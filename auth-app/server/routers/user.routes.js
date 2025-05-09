import express from "express";
import { getUserData } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/user-data", getUserData);

export default userRouter;
