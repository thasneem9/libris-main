import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        trim:true

    },
    password:{
        type:String,
        required:true,

    },
    theme:{
        type:String,
        enum:['wooden','glass','custom'],
        default:'wooden'
    },
    customWallpaper:{
        type:String,
        default:null
    },
    
}, {timestamps:{createdAt:true, updatedAt:false}})

const User=mongoose.model('User',userSchema);

export default User;