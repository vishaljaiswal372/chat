import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const port=process.env.port;
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoutes);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    connectDB();
});
