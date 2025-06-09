import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import bookRoutes from './routes/bookRoutes.js'
import userRoutes from './routes/userRoutes.js'
dotenv.config();

const app = express();

// Middleware
app.use(cors({origin:'http://localhost:3000',credentials:true}));
app.use(express.json());
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use('/api/users',userRoutes)
app.use('/api/books',bookRoutes)
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Test route
app.get('/', (req, res) => {
  res.send('Server is up and running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
