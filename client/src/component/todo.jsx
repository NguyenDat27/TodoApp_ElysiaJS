const Todo = ({ todo }) => {
    return (
      <div
        className={`p-4 border rounded-lg shadow-sm mb-4 ${
          todo.completed ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <h3 className="text-lg font-semibold mb-2">{todo.title}</h3>
        <p className="text-sm text-gray-700 mb-1">Mô tả: {todo.description}</p>
        <p className="text-sm">
          Trạng thái:{" "}
          <span
            className={`font-bold ${
              todo.completed ? "text-green-600" : "text-red-600"
            }`}
          >
            {todo.completed ? "Hoàn thành" : "Chưa hoàn thành"}
          </span>
        </p>
      </div>
    );
  };
  
export default Todo;