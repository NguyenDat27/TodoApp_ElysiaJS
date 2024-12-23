import { t } from "elysia";
import Todo from "../models/todo";

export const GetTodos = async ({ set }: { set: { status: number } }) => {
  try {
    const todos = await Todo.find({});
    set.status = 200;
    return todos;
  } catch (err) {
    set.status = 500;
    return { message: "Internal Server Error" };
  }
};

export const GetTodo = async ({ params: { todo_id }, set }: { 
  params: { todo_id: string }, 
  set: { status: number, headers: { [key: string]: string } } 
}) => {
  try {
    const todo = await Todo.findById(todo_id).lean();
    if (!todo) {
      set.status = 404;
      set.headers = { 'Content-Type': 'application/json' };
      return { message: "Todo not found" };
    }
    set.status = 200;
    set.headers = { 'Content-Type': 'application/json' };
    return todo;
  } catch (err) {
    set.status = 500;
    set.headers = { 'Content-Type': 'application/json' };
    return { message: "Internal Server Error" };
  }
};
  
  

export const AddTodo = async ({ body, set }: { 
  body: { title: string, description: string, completed: boolean }, 
  set: { status: number } 
}) => {
  try {
    const newTodo = new Todo(body);
    await newTodo.save();
    set.status = 201;
    return { message: "Todo created successfully" };
  } catch (err) {
    set.status = 500;
    return { message: "Internal Server Error" };
  }
};

export const UpdateTodo = async ({ body, set, params: { todo_id } }: { 
  body: { title: string, description: string, completed: boolean }, 
  set: { status: number }, 
  params: { todo_id: string } 
}) => {
  try {
    const foundTodo = await Todo.findById(todo_id);
    if (!foundTodo) {
      set.status = 404;
      return { message: "Todo not found" };
    }

    await Todo.findByIdAndUpdate(todo_id, body);
    set.status = 200;
    return { message: "Todo updated successfully" };
  } catch (err) {
    set.status = 500;
    return { message: "Internal Server Error" };
  }
};

export const DeleteTodo = async ({ params: { todo_id }, set }: { 
  params: { todo_id: string }, 
  set: { status: number } 
}) => {
  try {
    const foundTodo = await Todo.findById(todo_id);
    if (!foundTodo) {
      set.status = 404;
      return { message: "Todo not found" };
    }

    await Todo.findByIdAndDelete(todo_id);
    set.status = 200;
    return { message: "Todo deleted successfully" };
  } catch (err) {
    set.status = 500;
    return { message: "Internal Server Error" };
  }
};

