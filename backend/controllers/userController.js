import User from '../models/User.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';

dotenv.config()

const createAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '40m' });

const createRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

const signupUser=async(req,res)=>{
    try {
        const {name,username,email,password}=req.body;

       
            let existingUser= await User.findOne({ $or: [{email},{username}]});
            if(existingUser){
                console.log('userf found',existingUser);
                return res.status(409).json({message:"USER ALREADY EXISTS"});

            }
            const saltRounds=10;
            const hashedPassword=await bcrypt.hash(password,saltRounds);
            
            const newUser=new User({email,username,password:hashedPassword,name});
            await newUser.save();
            console.log("Created new user",newUser)

            return res.status(200).json({message:"USER CREATED SUCCES",newUser})
        
    } catch (error) {
        console.error(error);
    return res.status(500).json({ error: "Internal server error" });
    }

}
const loginUser=async(req,res)=>{
    try {
        const {username,password}=req.body;
    
        const user=await User.findOne({username})
        if(!user){
            return res.status(404).json({message:"User does not exist"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

   res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true, 
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 daysss
});

    res.json({ accessToken });
        res.status(200).json({message:"Login Successful"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
        
    }
}
export const refreshAccessToken=(req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = createAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  });
}

 const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out' });
};

export {signupUser,loginUser,logout}