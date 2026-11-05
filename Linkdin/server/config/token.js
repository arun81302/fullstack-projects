import jwt from 'jsonwebtoken'

const genToken=async (userId)=>{
    try{
        let token=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"2d"})
        return token
    } catch(err){
        console.log(err);
    }
}

export default genToken