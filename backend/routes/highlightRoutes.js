import express from 'express'
import { add,get } from '../controllers/highlightcontroller.js';
const router=express.Router()

router.get('/get/:bookId', get);
router.post('/add/:bookId', add);

export default router
