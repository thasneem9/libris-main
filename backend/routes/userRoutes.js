
import {signupUser,loginUser} from '../controllers/userController.js'
import express from 'express'

const router=express.Router()

router.post('/signup',signupUser)
router.post('/login',loginUser)


export default router