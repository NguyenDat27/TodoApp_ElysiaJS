import mongoose from 'mongoose';

const Todo = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Todo', Todo);
