import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
const mongoose from 'mongoose'

dotenv.config();


const app=express()
app.use(cors())
const PORT= process.env.PORT || 3000;




app.listen(port,()=>{
    console.log('port is running ')
})
