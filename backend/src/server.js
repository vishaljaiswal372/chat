import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
dotenv.config();
const port=process.env.port;
const app=express();

app.use("/api/auth",authRoutes);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    connectDB();
});
