// routes/drawings.js
import express from 'express';
import {
  getDrawings,
  createDrawing,
  deleteDrawing,
} from '../controllers/drawingController.js';

const router = express.Router();

router.get('/', getDrawings);          // ?bookId=...&page=...
router.post('/', createDrawing);       // Save stroke
router.delete('/:id', deleteDrawing);  // Delete by ID

export default router;
