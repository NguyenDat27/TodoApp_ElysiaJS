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
    name: 'jwtAccessToken',
    secret: process.env.JWT_ACCESS_SECRET || "",
    algorithms: ['HS256'],
    exp: process.env.JWT_ACCESS_EXP // Thời gian sống của access token
  }))

  .use(jwt({
    name: 'jwtRefreshToken',
    secret: process.env.JWT_REFRESH_SECRET || "",
    algorithms: ['HS256'],
    exp: process.env.JWT_REFRESH_EXP // Thời gian sống của refresh token
  }))
  
  .use(AuthRoutes)
  .use(TodoRoutes)

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);