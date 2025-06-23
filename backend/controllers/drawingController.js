// controllers/drawingController.js
import Drawing from '../models/Drawing.js'

export const getDrawings = async (req, res) => {
  try {
    const { bookId, page } = req.query;
    const query = { bookId };
    if (page) query.page = page;
    const drawings = await Drawing.find(query);
    res.json(drawings);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

export const createDrawing = async (req, res) => {
  try {
    const drawing = await Drawing.create(req.body);
    res.status(201).json(drawing);
  } catch (err) {
    res.status(400).json({ error: 'Create failed' });
  }
};

export const deleteDrawing = async (req, res) => {
  try {
    await Drawing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
};
