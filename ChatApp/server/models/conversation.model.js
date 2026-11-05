import mongoose from "mongoose";
import { User } from "./user.model";
 const conversation=new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
 },{timestamps:true})

 export const Conversation=mongoose.model('Conversation',conversation)