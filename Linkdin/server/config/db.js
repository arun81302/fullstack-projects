import mongoose from "mongoose";


const connectDB= async ()=>{
    try{
await mongoose.connect(process.env.URI)
console.log('databse connected successfully')
    }catch(err){
console.log(err.message)
    }
}

export default connectDB