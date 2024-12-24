import { apiGetAllTodos, apiSearchTodo, apiCreateTodo, apiGetTodo, apiStatusTodo, apiDeleteTodo, apiUpdateTodo, apiPercentTodo } from "../api";
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

export const getTodoByStatus = async (status) => {
  try {
    const response = await axios.get(apiStatusTodo(status));
    return response.data
  } catch (err) {
      console.log(err)
  }
}

export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(apiDeleteTodo(id));
    return response.data.message
  } catch (err) {
      console.log(err)
  }
}

export const updateTodo = async (id, todo) => {
  try {
    const response = await axios.put(apiUpdateTodo(id), todo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting todo:", error);
    throw error;
  }
}

export const percentTodo = async () => {
  try {
    const response = await axios.get(apiPercentTodo);
    return response.data.completionPercentage;
  } catch (err) {
      console.log(err);
  }
}