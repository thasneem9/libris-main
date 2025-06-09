import mongoose from 'mongoose'

const highlightSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId,required: true },
  userId: { type: mongoose.Schema.Types.ObjectId }, // if needed
  position: Object,
  content: Object,
  comment: String,
  color: String,
}, { timestamps: true });

const Highlight = mongoose.model('Highlight', highlightSchema);

export default Highlight