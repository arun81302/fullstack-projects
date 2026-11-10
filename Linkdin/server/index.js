import dns from 'dns'; dns.setServers(['8.8.8.8','1.1.1.1']);
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';

dotenv.config()
const app=express()

app.use(express.json())
app.use(cookieParser() )
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.get('/',(req,res)=>{
    res.send('server is running')
   
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(process.env.PORT||5000,()=>
    {
        connectDB()
        console.log('server is running')
    })