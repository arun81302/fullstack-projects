import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'

export const signUp=async (req,res)=>{
    try{
        let {firstName,lastName,userName,email,password}=req.body
        let existEmail=await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:'email already exist!'})
        }
        let existUser=await User.findOne({userName})
        if(existUser){
            return res.status(400).json({message:'UserName already exist!'})
        }
        if(password.length<8){
            return res.status(400).json({message:"password must be atleast greate then 8 character"})
        }

        let hashedPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword
        })


        let token= await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:2*24*60*60*1000,
            sameSite:'strict',
            secure:process.env.NODE_ENVIRONMENT==="production"

        })
        return res.status(201).json(user)



    }catch(error){
        console.log(error)
        return res.status(500).json({message:'singupError'})
        
    }
}


export const login= async(req,res)=>{
    try{
        let {email,password}=req.body
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"email not found"})
        }


        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }

        let token= await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:2*24*60*60*1000,
            sameSite:'strict',
            secure:process.env.NODE_ENVIRONMENT==="production"

        })
        return res.status(201).json({message:"Login Successful"})
    }catch(err){
        console.log(error)
        return res.status(500).json({message:'LoginError'})
    }
}


export const logout=async (req,res)=>{
    try{
        res.clearcookie("token")
        return res.status(200).json({message:'logout successful'})
    }catch(err){
        console.log(err)
        return res.status(400).json({message:'shh error'})
    }
}