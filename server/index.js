import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- THIS IS THE NEW HEALTH CHECK ROUTE ---
app.get('/api/health', (req, res) => {
    console.log("Health check endpoint was hit!"); // This message will appear in your Render logs
    res.status(200).json({ status: 'UP' });
});
// ------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
    res.send('Hackathon Portal API is running...');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});