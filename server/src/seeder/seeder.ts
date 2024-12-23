import fs from 'fs';
import mongoose from 'mongoose';
import Elysia from 'elysia';
import { connectDB } from '../configs/connectDB';
import Todo from '../models/todo';
import path from 'path';

const app = new Elysia();

const loadData = async () => {
  try {
    // Kết nối MongoDB
    await connectDB()
    // Đọc dữ liệu từ file JSON
    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const todos = JSON.parse(rawData);

    // Chèn dữ liệu vào MongoDB
    await Todo.deleteMany({}); 
    const result = await Todo.insertMany(todos);
    console.log('Data successfully inserted:', result);

    // Đóng kết nối MongoDB
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error inserting data: ', err);
  }
};

// Gọi hàm loadData khi server bắt đầu chạy
app.listen(3000, loadData);
