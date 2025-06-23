// models/Drawing.js
import mongoose from 'mongoose';

const drawingSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true },
    page: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    color: { type: String, required: true },
    points: [[Number]], // Array of [xPct, yPct]
  },
  { timestamps: true }
);

export default mongoose.model('Drawing', drawingSchema);
