import mongoose from 'mongoose'
import User from './User.js'

const bookSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    category:{
        type:String
    },
    fileName:{
        type:String
    },
    author:{
        type:String
    },
    coverImage:{
        type:String,
        default:null

    }

},{timestamps:true})


const Book=mongoose.model('Book',bookSchema)
export default Book;