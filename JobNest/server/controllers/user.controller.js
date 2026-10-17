import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

export const register= async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,password,role}=req.body
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:'something is missing',
                success:false
            })
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:'user already registerd with this email',
                success:false
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)

        await user.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
        })
        return res.status(201).json({
            message:'account created successfully',
            success:true
        })
    }catch(err){

    }
}


export const login=async (req,res)=>{
    try{
const {email,password,role}=req.body
if(!email || !password || !role){
            return res.status(400).json({
                message:'something is missing',
                success:false
            })
        }
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"incorrect emial or password",
                success:false
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
             return res.status(400).json({
                message:"incorrect emial or password",
                success:false
            })
        }
        if(role!=user.role){
            return res.status(400).json({
                message:"account doesn't exist with current role",
                success:false
            })
        }
        const tokenData={
            userId:user._id
        }
        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile

        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1D'});
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            success:true
        })
    }catch(err){
return err
    }
}



export const logout=async(res,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            message:true
        })
    }catch(err){
        console.log(err)
    }
}


export const updateProfile=async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,bio,skills}=req.body
        const file=req.file
        if(!fullname || !email || !phoneNumber || !bio ||!skills){
            return res.status(400).json({
                message:'something is missing',
                success:false
            })
        }

        //coloudinary


        const skillsArray=skills.split(",")
        const userId=req._id
        let user=await User.findById(userId)


        user.fullname=fullname,
        user.email=email,
        user.phoneNumber=phoneNumber,
        user.profile.bio=bio,
        user.profile.skills=skillsArray

        await user.save()

         user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile

        }


        return res.status(200).json({
            message:'profile updated successfully',
            user,
            successful:true
        })
    }catch(err){
        console.log(err)
    }
}