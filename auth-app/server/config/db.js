import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://abhishek4712ak1_db_user:2mBJMySRZVGT9ohw@cluster0.t5tthny.mongodb.net/authApp?appName=Cluster0");
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
}

export default connectDB;



