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
  try {
 

    const updated = await Annotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Server error during annotation update' });
  }
};


export const del = async (req, res) => {
  await Annotation.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
