import { useTodo } from "../store/todoStore";
import { getTodoBySearch, getAllTodos } from "../api/TodoApi";
import { Input } from "antd";

const SearchComponent = () => {
  const [todos, setTodos] = useTodo.todos();
  const [keyword, setKeyword] = useTodo.keyword();

  const handleSearchChange = async (key) => {
    if (key !== "") {
      try {
        const data = await getTodoBySearch(key);
        setTodos(data); 
        setKeyword(key);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await getAllTodos();
        setTodos(data);
        setKeyword(key);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-5 mt-5">
        <Input.Search
          placeholder="Tìm kiếm tiêu đề ..."
          onSearch={(key) => handleSearchChange(key)}
          enterButton
          allowClear
        />
    </div>
  );
};

export default SearchComponent;
