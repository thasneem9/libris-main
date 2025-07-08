import express from 'express'
import {addBook,getBooks,uploadToAws, removeBook,uploadCover,getCategories, getAllCategories, deleteBook} from '../controllers/bookController.js'
const router=express.Router()


router.get('/getBookData',getBooks)
router.get('/categories',getAllCategories)
router.post('/addBook',addBook);


router.post('/upload',uploadToAws);
router.post('/delete',deleteBook);
router.post('/upload-cover',uploadCover)

export default router

/*  mongoose:
router.get('/getBookData',getBooks) 
router.get('/categories',getCategories) 
router.post('/delete',removeBook);  */
