import { useState } from 'preact/hooks';
import CustomButton from '../component/button'
import CustomModal from '../component/modal';
import { useTodo } from '../store/todoStore';
import { createTodo, getAllTodos } from '../api/TodoApi';

const Create = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [_, setTodos] = useTodo.todos();
  
    const handleAddTodo = async (todo) => {
        try {
          const result = await createTodo(todo);
          message.success("Thêm todo thành công!");
          console.log("Todo created:", result);
          setIsModalOpen(false);
          const data = getAllTodos();
          setTodos(data);
        } catch (error) {
          message.error("Lỗi khi thêm todo!");
        }
    };

    const handleClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto pl-5">
          <CustomButton variant="primary" onClick={() => handleClick()}>
            Thêm Todo
          </CustomButton>

          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTodo}
            isCreate={true}
          />
        </div>
    );
}

export default Create
