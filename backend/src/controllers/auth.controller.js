import { upsertSteramUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";



export async function signup(req,res) {
    const { email, password, fullname } = req.body;

    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: "All fields are required" }); // FIXED
        }
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/; // At least one uppercase, one lowercase, one digit
        
        if (password.length < 6 && !passRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long with one uppercase,one lowercase and one digit" }); // FIXED
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" }); // FIXED
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const idx = Math.floor(Math.random()*100)+1;// Random index for profile picture
        const profilepic = `https://avatar.iran.liara.run/public/${idx}`; // Generate a random profile picture URL

        const newUser = await User.create({
            email,
            fullname,
            password,
            profilepic: profilepic
        });

       try{
         await upsertSteramUser({
            id:newUser._id.toString(),
            name:newUser.fullname,
            image:newUser.profilepic || ""
        });
        console.log(`Stream User created for ${newUser.fullname}`);
       }
       catch(error){
        console.log("Error Occurred ")
       }
        const token = jwt.sign({userID:newUser._id},process.env.JWT_SECRET, {expiresIn: "7d"});
        
        res.cookie("token",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production" // Use secure cookies in production
        });
        res.status(201).json({sucess:true,user:newUser});
    }
    catch (error) {
        console.error("Signup error:", error); // Add this line
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body; // FIXED: req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // FIXED: user._id

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
export function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
export async function onboard(req,res){
    try {
        const userId = req.user._id;

        const {fullname,bio,hobbies,location} = req.body;

        if(!fullname || !bio || !hobbies || !location){
            return res.status(400).json({message: "All fields are required",
                missingFields: [
                    !fullname && "fullname",
                    !bio && "bio",
                    !hobbies,
                    !location && "location"
                ]
                
            });
        }  
        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded: true
        },{new: true});
        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }
        try {
            await upsertSteramUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullname,
            image: updatedUser.profilepic || ""
        });
        console.log(`Stream User updated for ${updatedUser.fullname}`);
        } catch (error) {
            console.error("Error occurred while updating Stream User:", error);
        }
        
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}