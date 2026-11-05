import dns from 'dns'; dns.setServers(['8.8.8.8','1.1.1.1']);
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';


dotenv.config({})

const app=express()





const port=process.env.PORT || 2000
app.listen(port,()=>{
    connectDB()
    console.log('servr is running')
})