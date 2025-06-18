import express from 'express';
import { get, save, update, del } from '../controllers/annotationController.js';

const router = express.Router();

router.get('/', get);
router.post('/', save);
router.put('/:id', update);
router.delete('/:id', del);

export default router;

