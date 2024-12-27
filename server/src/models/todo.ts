import mongoose from 'mongoose';

const Todo = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true ,
      index: true
    },
    description: { 
      type: String, 
      required: true 
    },
    completed: { 
      type: Number,
      enum: [0, 1],
      default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Todo', Todo);
