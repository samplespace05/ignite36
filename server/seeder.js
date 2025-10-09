import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

// --- EDIT THIS LIST WITH YOUR ACTUAL TEAM DATA ---
const usersToInsert = [
  {
    email: 'team.leader.one@college.edu',
    teamName: 'Team Phoenix',
    certificateFiles: ['phoenix_1.pdf', 'phoenix_2.pdf', 'phoenix_3.pdf', 'phoenix_4.pdf', 'phoenix_5.pdf', 'phoenix_6.pdf'],
  },
  {
    email: 'another.leader@college.edu',
    teamName: 'Cyber Warriors',
    certificateFiles: ['warriors_1.pdf', 'warriors_2.pdf', 'warriors_3.pdf', 'warriors_4.pdf', 'warriors_5.pdf', 'warriors_6.pdf'],
  },
  // ...add all your other teams here
];
// -------------------------------------------------

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany();
    console.log('Existing users cleared.');

    await User.insertMany(usersToInsert);
    console.log('✅ Data successfully imported!');
    
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();