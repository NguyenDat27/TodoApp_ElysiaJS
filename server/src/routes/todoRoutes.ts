import { Elysia } from "elysia";
import * as TodoController from "../controllers/todoController";

const TodoRoutes = new Elysia();

TodoRoutes.group("/api/v1/todos", (TodoRoutes) =>
  TodoRoutes
    .get("/", TodoController.GetTodos)
    .get("/:todo_id", TodoController.GetTodo)
    .post("/", TodoController.AddTodo)
    .put("/:todo_id", TodoController.UpdateTodo)
    .delete("/:todo_id", TodoController.DeleteTodo)
);

export default TodoRoutes;
