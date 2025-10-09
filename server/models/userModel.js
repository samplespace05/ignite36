import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  magicToken: {
    type: String,
    default: null,
  },
  magicTokenExpires: {
    type: Date,
    default: null,
  },
  certificateFiles: {
    type: [String],
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;