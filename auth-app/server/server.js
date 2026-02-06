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
const PORT = 5000;

connectDB();

const corsOptions = {
  origin: "https://auth-app-mern-two.vercel.app/"), // Your production domain
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (cookies)
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});







