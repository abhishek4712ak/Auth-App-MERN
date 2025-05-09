import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

