import Highlight from '../models/Highlight.js'; // Import the Highlight model
import express from "express";
import dotenv from 'dotenv';

dotenv.config();

const add = async (req, res) => {
  try {
    const { highlights } = req.body;
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ error: 'bookId is required' });
    }

    if (!Array.isArray(highlights)) {
      return res.status(400).json({ error: 'highlights must be an array' });
    }

    // Remove all existing highlights for this bookId
    await Highlight.deleteMany({ bookId });

    // Add all new highlights
    const highlightsToSave = highlights.map(h => ({
      bookId,
      userId: h.userId || null,  // optional if you track users
      position: h.position,
      content: h.content,
      comment: h.comment,
      color: h.color,
    }));

    await Highlight.insertMany(highlightsToSave);

    res.status(200).json({ message: 'Highlights saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add highlight' });
  }
};

const get = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ error: 'bookId is required' });
    }

    const highlights = await Highlight.find({ bookId }).lean();

    res.status(200).json({ highlights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get highlights' });
  }
};

export { add, get };
