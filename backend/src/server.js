import express from "express";
import dotenv from "dotenv";
dotenv.config();
const port=process.env.port;
const app=express();


app.get("/api/auth/signup",(req,res)=>
{
    res.send("sign up route");
});

app.get("/api/auth/login",(req,res)=>
{
    res.send("login route");
});

app.get("/api/auth/logout",(req,res)=>
{
    res.send("logout route");
});

app.listen(port,()=>{console.log(`server is running on port ${port}`);});
