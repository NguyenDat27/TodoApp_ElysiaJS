import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description: string;
  completed: number;
  userId: mongoose.Schema.Types.ObjectId;
}

const TodoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Number, enum: [0,1], default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<ITodo>('Todo', TodoSchema);