import jwt from 'jsonwebtoken';
import  User  from '../models/User.js';
import cookieParser from 'cookie-parser';




export const protectRoute = async (req, res, next) => {
    try{
        const token= req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Unauthorized token not found"});
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({message: "Unauthorized token not valid"});
        }
        const user = await User.findById(decode.userID).select("-password");
        if(!user){
            return res.status(401).json({message: "unauthorized user not found"});
        }
        req.user = user;
        next();
    }
    catch(error){
        console.error("Error in auth middleware:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
