import express from 'express'
import {addBook,getBooks,uploadToAws, removeBook,uploadCover} from '../controllers/bookController.js'
const router=express.Router()

router.get('/getBookData',getBooks)
router.post('/addBook',addBook);
router.post('/upload',uploadToAws);
router.delete('/delete',removeBook);
router.post('/upload-cover',uploadCover)

export default router
