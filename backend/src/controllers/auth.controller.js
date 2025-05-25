import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export const signup=async (req,res)=>{
    // console.log("Request Body: ", req.body);
    const {fullName,email,password}=req.body;
    try {
        if(!email || !password || !fullName){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length<6){
            return res.status(400).json({message:"password must have at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"email already exist, please use another email"});

        const idx=Math.floor(Math.random()*100)+1; // generate a num between 1-100

        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser=await User.create({email:email,password:password,fullName:fullName,profilePic:randomAvatar,});

        // TODO:create a  the user in stream as well
        try 
        {
            await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        }catch(error)
        {
            console.log("error creating stream user",error);
        }


        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        });

        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly:true, // prevent xss attacks
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
        });

        res.status(201).json({success:true,user:newUser});

    } catch (error) {
            console.log("Error in signup controller",error);
            res.status(500).json({message:"internal server error"});
    }
}

export const login= async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password) res.status(400).send({message:"all fields are required"});
        const user=await User.findOne({email:email});
        if(!user) res.status(401).send({message:"give the correct credentials"});

        //const ispasswordmatch=await bcrypt.compare(password,user.password);

        const ispasswordmatch=await user.matchPassword(password);
        if(ispasswordmatch)
        {
            const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
                expiresIn:"7d"
            });

            res.cookie("jwt",token,{
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly:true, // prevent xss attacks
                sameSite:"strict",
                secure:process.env.NODE_ENV==="production",
            });

            res.status(201).json({success:true,user:user});
        }
        else res.status(401).send({message:"invalid password"});
    } catch (error) {
            console.log("Error in signup controller",error);
            res.status(500).json({message:"internal server error"});
    }
}

export const logout= async (req,res)=>{
    res.clearCookie("jwt");
    res.status(200).send({success:true,message:"logout successfully"})
}
