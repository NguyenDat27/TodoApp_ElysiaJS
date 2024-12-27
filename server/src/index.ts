import { Elysia } from "elysia";
import { connectDB } from "./configs/connectDB";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import dotenv from "dotenv";
import TodoRoutes from './routes/todoRoutes';
import AuthRoutes from './routes/authRoutes';

// Tải biến môi trường từ tệp .env
dotenv.config();

// Kiểm tra biến môi trường JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Kết nối DB
connectDB();

// Khởi tạo app
const app = new Elysia()

  .use(
    swagger({
      path: '/v1/swagger',
      documentation: {
        info: {
          title: 'TODO APP',
          version: '1.0.0',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [{
          bearerAuth: [],
        }],
      },
    })
  )
  .use(cors())
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    exp: '1d',
  }))
  .use(AuthRoutes)
  .use(TodoRoutes)

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);