import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Feedback from './models/feedbackModel.js'; // <-- Import the Feedback model
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

// This is your list of official team leaders.
const usersToInsert = [
  {
    email: 'vedantagr0212@gmail.com', // Your test email
    teamName: 'Test Team Alpha',
    certificateFiles: ['cert1.pdf', 'cert2.pdf', 'cert3.pdf', 'cert4.pdf', 'cert5.pdf', 'cert6.pdf'],
  },
  // ...add all your other official teams here
];

const importData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined. Please check your server/.env file.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // --- WIPE THE DATABASE CLEAN ---
    await User.deleteMany();
    console.log('✅ Users collection cleared.');
    
    await Feedback.deleteMany(); // <-- This line wipes all feedback
    console.log('✅ Feedbacks collection cleared.');
    // -----------------------------

    // Insert the fresh user data
    await User.insertMany(usersToInsert);
    console.log('✅ Fresh user data imported!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error with data import/wipe:', error);
    process.exit(1);
  }
};

importData();