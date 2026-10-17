import mongoose from "mongoose";


const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.URI)
        console.log("MongoDB connected successfully!");
    }catch(err){
    
        console.error("MongoDB connection failed:", err.message);
        
    }
}


export default connectDB