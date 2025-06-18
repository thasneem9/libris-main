import Annotation from '../models/Annotation.js';

// GET: all annotations for a book
export const get = async (req, res) => {
  const { bookId } = req.query;
  if (!bookId) return res.status(400).json({ error: 'bookId required' });
  const list = await Annotation.find({ bookId }).lean();
  res.json(list);
};

// POST: add new annotation
export const save = async (req, res) => {
  const data = new Annotation(req.body);
  await data.save();
  res.status(201).json(data);
};

// PUT: update existing annotation
export const update = async (req, res) => {
  const updated = await Annotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE: remove annotation
export const del = async (req, res) => {
  await Annotation.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
