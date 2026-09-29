import express from "express";
import bcrypt from "bcryptjs";
import { usermodel } from "../messge/userschema.js";
import jwt from "jsonwebtoken";

export const JWT="KEYY";
const authrouter=express.Router();

function signtoken(user){
    return jwt.sign({
        username:user.username,
        avatar:user.avatar
    },JWT,{expiresIn:"7d"});
}

export function verifyToken(req,res,next){
    const authhead=req.headers.authorization;
    const token =authhead && authhead.split(" ")[1];
    if(!token) return res.status(401).
    json({error:"No Token Provided"});

    try{
        req.user=jwt.verify(token,JWT);
        next();
    }catch(err){
        return res.status(401).json({error:"Invalid or expired token"})
    }
}

authrouter.post("/signup",async(req,res)=>{
    try{
        const {username,password,avatar}=req.body;
        if (!username || !password){
            return res.status(400).json({error:"Username and password are required"});
        }

        const exsisting=await usermodel.findOne({username});
        if(exsisting){
            return res.status(409).json({error:"that Username is already Taken"});
        }

        const Hashed=await bcrypt.hash(password,10);
        const user= await usermodel.create({ username, password: Hashed, avatar: avatar || "" });

        res.json({token:signtoken(user),username:user.username,avatar:user.avatar});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong creating your account"})
    }
})

authrouter.post("/login",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await usermodel.findOne({username});
        if(!user){
            return res.status(401).json({error:"Incorrect name or password"});
        }
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(401).json({error:"Incorrect name or password"});
        }


         res.json({token:signtoken(user),username:user.username,avatar:user.avatar});
    }catch(err){
        return res.status(500).json({error:"Something went wrong while Logging in"})
    }
})

authrouter.get("/users",verifyToken,async(req,res)=>{
    try{
        const users = await usermodel.find({},"username avatar -_id");
        res.json(users);
    }catch(err){
        return res.status(500).json({error:"Something went wrong loading users"})
    }
})


export default authrouter;