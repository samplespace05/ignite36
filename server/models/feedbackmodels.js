import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  valuableAspects: { type: String, required: true, trim: true },
  improvementAreas: { type: String, required: true, trim: true },
  overallExperience: { type: String, required: true, trim: true },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;