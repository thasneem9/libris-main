import express from 'express'
import {addBook,getBooks,uploadToAws, removeBook} from '../controllers/bookController.js'
const router=express.Router()

router.get('/getBookData',getBooks)
router.post('/addBook',addBook);
router.post('/upload',uploadToAws);
router.delete('/delete',removeBook);


export default router
