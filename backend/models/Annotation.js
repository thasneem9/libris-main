import mongoose from 'mongoose';

const annotationSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true },
    page: { type: Number, required: true },
    text: String,
    comment: String,
    color: { type: String, default: '#FFFF00' }, // highlight color
    xPct: Number,
    yPct: Number,
    wPct: Number,
    hPct: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Annotation', annotationSchema);
