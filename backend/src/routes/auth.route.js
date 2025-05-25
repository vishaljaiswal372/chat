import express from "express";
const router=express.Router();
import { protectRoute } from "./middleware/auth.middleware.js";
import {login,signup,logout,onboard} from "../controllers/auth.controller.js";

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/onboarding",protectRoute,onboard);

//check user is logged in or not 
router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
})

export default router;