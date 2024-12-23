import { Elysia } from "elysia";
import { connectDB } from "./configs/connectDB";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import todoRouter from './routes/todoRoutes';


// Kết nối DB
connectDB();

//Khởi tạo app

const app = new Elysia()

  app.use(
    swagger({
      path: '/v1/swagger',
      documentation: {
        info: {
          title: 'TODO APP',
          version: '1.0.0',
        },
      },
    })
  );
  app.use(cors()) 

  app.use(todoRouter)

  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
