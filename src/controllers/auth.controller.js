import bcrypt from "bcryptjs";
import {db} from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const register= async (req, res) => {
    const {email, password, name}= req.body;
    console.log("data", req.body)
    try {
        const existingUser= await db.user.findUnique({
            where:{
                email
            },
        })

        if (existingUser) {
            //forgot return -- mistake
           return  res.status(400).json({
                error: "User is already Exist"
            })  
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER
            }
        })

        const token= jwt.sign({id: newUser.id}, process.env.JWT_SECRET,{
            expiresIn:"7d"
        })
        // put jwt instead of "jwt"-- mistake
        res.cookie("jwt", token,{
            secure: true,
             httpOnly:true,
            // domain:process.env.COOKIE_DOMAIN,
            // sameSite:"lax",
            // maxAge:1000*60*60*24*7 // 7days
        })

        res.status(201).json({
            message: "User Created Successfully",
            user:{
                id:newUser.id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                image:newUser.image,
            }
        })
    } catch (error) {
        console.log("Error creating User ",error);
        res.status(500).json({error:"error creating user"})
    }
}
export const login= async (req, res) => {
    const { email, password}= req.body;

    try {
        const user= await db.user.findUnique({
            where:{email},
        })

        if (!user) {
            return res.status(401).json({error: "user not found"})
        }
         const isMatched= await bcrypt.compare(password, user.password);

         if (!isMatched) {
            return res.status(401).json({error:"invalid credentials"});
         }

         const token= jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"});

         res.cookie("jwt", token,{
             secure: true,
             httpOnly:true,
            // domain:process.env.COOKIE_DOMAIN,
            // sameSite:"lax",
            // maxAge:1000*60*60*24*7 // 7days
        })

        res.status(200).json({
            success:true,
            message:"user login Succesfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                image:user.image,
            }
        })

    } catch (error) {
        console.log("Error while user login ",error);
        res.status(500).json({error:"error while user login"})
    }
}
export const logout= async (req, res) => {
    try {
        res.clearCookie("jwt",{
            secure: true,
             httpOnly:true,
            // domain:process.env.COOKIE_DOMAIN,
            // sameSite:"lax",
            // maxAge:1000*60*60*24*7 // 7days
        })

        res.status(200).json({
            success:"true",
            message:"User logged out successfully"
        })
    } catch (error) {
        console.log("Error while logout ",error);
        res.status(500).json({error:"Error while logout"})
    }
}
export const check= async (req, res) => {
    try {
        res.status(200).json({
            success:true,
            message:"User Authenticated Successfully",
            user:req.user,
        })
    } catch (error) {
        console.log("Error while Check controller ",error);
        res.status(500).json({error:"Error while Check controller"})
    }
}