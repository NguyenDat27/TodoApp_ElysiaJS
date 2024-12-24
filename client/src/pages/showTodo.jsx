import Todo from "../component/todo";
import { useTodo } from "../store/todoStore";
import { getAllTodos } from '../api/TodoApi';
import { useEffect } from 'preact/hooks';

const ShowTodo = () => {

  const [todos, setTodos] = useTodo.todos();

  useEffect(() => {

    const fetchTodos = async () => {
      try {
        const data = await getAllTodos();
        setTodos(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto p-5">
      <div>
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default ShowTodo;