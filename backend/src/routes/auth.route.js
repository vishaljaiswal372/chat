import express from "express";
const router=express.Router();
import {login,signup,signin,logout} from "../controllers/auth.controller.js";

router.post("/signin",signin);
router.get("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

export default router;