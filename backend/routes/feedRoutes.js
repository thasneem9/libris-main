import express from 'express';
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getSinglePost
} from '../controllers/feedController.js';

import { authenticate  } from '../middleware/authenticate.js';

const router = express.Router();


router.get('/getAll', getAllPosts)
router.get('/getOne/:postId', getSinglePost);

router.post('/addPost', authenticate, createPost);
router.put('/edit/:postId', authenticate, updatePost);
router.delete('/remove/:postId', authenticate, deletePost);

router.post('/like/:postId', authenticate, toggleLike);
router.post('/comment/:postId', authenticate, addComment);


export default router;
