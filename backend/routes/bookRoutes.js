import express from 'express'
import {addBook,getBooks,uploadToAws, removeBook,uploadCover,getCategories, getAllCategories, deleteBook} from '../controllers/bookController.js'
import { authenticate } from '../middleware/authenticate.js'

const router=express.Router()


router.get('/getBookData',authenticate,getBooks)
router.get('/categories',authenticate,getAllCategories)
router.post('/addBook',authenticate,addBook);


router.post('/upload',authenticate,uploadToAws);
router.post('/delete',authenticate,deleteBook);
router.post('/upload-cover',authenticate,uploadCover)

export default router

/*  mongoose:
router.get('/getBookData',getBooks) 
router.get('/categories',getCategories) 
router.post('/delete',removeBook);  */
