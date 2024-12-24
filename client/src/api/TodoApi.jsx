import { apiGetAllTodos, apiSearchTodo, apiCreateTodo } from "../api";
import axios from "axios";

export const getAllTodos = async () => {
    try {
        const response = await axios.get(apiGetAllTodos);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const getTodoBySearch = async (title) => {
    try {
        const response = await axios.get(apiSearchTodo(title));
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const createTodo = async (todo) => {
    try {
      const response = await axios.post(apiCreateTodo, todo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error posting todo:", error);
      throw error;
    }
  };
