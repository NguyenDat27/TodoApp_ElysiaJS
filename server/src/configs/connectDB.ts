// src/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('MONGO_URL:', process.env.MONGODB_URL);

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables");
    }
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};
