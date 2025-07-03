
import {signupUser,loginUser,refreshAccessToken,logout} from '../controllers/userController.js'
import express from 'express'
import { protectRoute } from "../middleware/protectRoute.js";


const router=express.Router()

router.post('/signup',signupUser)
router.post('/login',loginUser)
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);


export default router