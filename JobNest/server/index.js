import dns from 'dns'; dns.setServers(['8.8.8.8','1.1.1.1']);

import e from 'express'
import cookie from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from "./routes/user.route.js"

const app=e()
dotenv.config({})

//middleware
app.use(e.json())
app.use(e.urlencoded({extended:true}))
app.use(cookie())
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true

}
app.use(cors(corsOptions))




app.get('/home',(req,res)=>{
    res.send('Server is working properly')
})

const PORT =process.env.PORT || 2001

//apis

app.use





app.listen(PORT,()=>{
    connectDB()
    console.log(`sever is running on ${PORT}`)
})