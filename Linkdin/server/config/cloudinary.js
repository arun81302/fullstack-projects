const cloudinary = require('cloudinary').v2;
import fs from 'fs'

const uploadOnCloudinary= async (filePath)=>{
      cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
        api_key: process.env.CLOUDINARY_APIKEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    try{
        if(!filePath){
            return null

        }
         const uploadResult = await cloudinary.uploader
       .upload(filePath)
        fs.unlinkSync(filePath)
        return uploadResult.secure_url
    }catch(err){
          fs.unlinkSync(filePath)
        console.log(err)
    }
}


export default uploadOnCloudinary