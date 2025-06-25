import Book from '../models/Book.js'
import User from '../models/User.js'
import express from "express";
import dotenv from 'dotenv';
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import cloudinary from '../utils/cloudinary.js';

import streamifier from 'streamifier'
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).single("pdf");

const uploadToAws = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ error: "Upload failed", details: err.message });
    }
    res.status(200).json({ msg: "File uploaded successfully", file: req.file });
  });
};


const addBook=async(req,res)=>{
    try {
        const {title,author,category,fileName,coverImage}=req.body;
        const userId="6837dbd20a4cf1792085e993"
        const newBook= new Book({title,author,category,userId,coverImage,fileName})
        await newBook.save();

        res.status(200).json({messgae:"SUUCESSFULT SAVED BOOK DETAILS",newBook})
        
    } catch (error) {
         console.error(error);
    res.status(500).json({ error: 'Failed to add book' });
        
    }
}
const getBooks=async(req,res)=>{
try {
       const userId="6837dbd20a4cf1792085e993"
       const books=await Book.find({userId})
       console.log(books)
       return res.status(200).json({message:"suuccessfully found",books})  

} catch (error) {
    console.log(error)
        res.status(500).json({ error: 'Failed to fetch book data' });

    
}

}

const removeBook = async (req, res) => {
  const { fileName, bookId } = req.body;

  if (!fileName || !bookId) {
    return res.status(400).json({ error: "fileName and bookId are required" });
  }

  // Step 1: Remove from AWS S3
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName, // should exactly match the uploaded file's key
  };

  try {
    await s3.deleteObject(params).promise();

    // Step 2: Optionally remove from MongoDB
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({ msg: "Book removed from S3 and database" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to remove book", details: err.message });
  }
};
// For cover image upload to Cloudinary
const memoryUpload = multer(); // defaults to memoryStorage

const uploadCover = [
  memoryUpload.single('cover'),
  async (req, res) => {
    try {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'book_covers' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      res.json({ url: result.secure_url });
    } catch (err) {
      console.error('Cloudinary error:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  }
];


export {addBook,getBooks, uploadToAws, removeBook,uploadCover} 
