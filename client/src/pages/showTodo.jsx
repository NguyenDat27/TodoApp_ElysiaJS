import Todo from "../component/todo";
import { useTodo } from "../store/todoStore";
import { getAllTodos, percentTodo } from '../api/TodoApi';
import { useEffect } from 'preact/hooks';

const ShowTodo = () => {

  const [todos, setTodos] = useTodo.todos();
  const [_, setPercent] = useTodo.percent();

  useEffect(() => {

    const fetchTodos = async () => {
      try {
        const data = await getAllTodos();
        setTodos(data);
        const percent = await percentTodo();
        const roundedPercent = percent.toFixed(1);
        setPercent(roundedPercent);
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