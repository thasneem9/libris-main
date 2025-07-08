import express from 'express';
import {  saveAnn, updateAnn, delAnn,getAnn } from '../controllers/annotationController.js';

const router = express.Router();
/* 
router.get('/', get); */
router.get('/', getAnn);
router.post('/', saveAnn);
router.put('/:id', updateAnn);
router.delete('/:id', delAnn);

export default router;

