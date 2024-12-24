import { useState } from 'preact/hooks';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { deleteTodo, updateTodo } from '../api/TodoApi';
import CustomModal from './modal';

const Todo = ({ todo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở modal khi nhấn vào nút Edit
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  // Hàm xử lý cập nhật todo
  const handleUpdateTodo = async (updatedTodo) => {
    try {
      const result = await updateTodo(todo._id, updatedTodo);
      message.success(result.message);
      setIsModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error("Lỗi khi cập nhật todo!");
    }
  };

  // Hàm xử lý xóa todo
  const handleDelete = async (id) => {
    try {
      const mess = await deleteTodo(id);
      message.success(mess);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      message.error("Không xóa được!!!");
    }
  };

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

      <div className="flex justify-end gap-4 mt-4">
        <EditOutlined
          onClick={handleEdit}
          className="text-blue-600 cursor-pointer"
        />
        <DeleteOutlined
          onClick={() => handleDelete(todo._id)}
          className="text-red-600 cursor-pointer"
        />
      </div>

      {/* Hiển thị modal để cập nhật todo */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateTodo}
        isCreate={false}
        initialValues={todo}
      />
    </div>
  );
};

export default Todo;
