import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

// --- THIS IS THE FIX ---
// It explicitly tells dotenv where to find the .env file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });
// --------------------

// --- EDIT THIS LIST WITH YOUR ACTUAL TEAM DATA ---
const usersToInsert = [
  {
    email: 'vedantagr0212@gmail.com', // Your test email
    teamName: 'Test Team Alpha',
    certificateFiles: ['cert1.pdf', 'cert2.pdf', 'cert3.pdf', 'cert4.pdf', 'cert5.pdf', 'cert6.pdf'],
  },
  // ...add all your other teams here
];
// -------------------------------------------------

const importData = async () => {
  try {
    // This check provides a clearer error if the .env file is still not found
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined. Please check your server/.env file.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // This clears old data before inserting new data
    await User.deleteMany();
    console.log('Existing users cleared.');

    await User.insertMany(usersToInsert);
    console.log('✅ Data successfully imported!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error with data import:', error);
    process.exit(1);
  }
};

importData();