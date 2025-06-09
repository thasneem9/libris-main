import User from '../models/User.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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
        res.status(200).json({message:"Login Successful"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
        
    }
}
export {signupUser,loginUser}