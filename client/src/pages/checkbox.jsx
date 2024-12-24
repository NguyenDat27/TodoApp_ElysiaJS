import React, { useState } from "react";
import { Checkbox, Space } from "antd";
import { useTodo } from "../store/todoStore";
import { getAllTodos, getTodoByStatus } from "../api/TodoApi";

// Hàm API

const TodoStatusFilter = () => {
    const [_, setTodos] = useTodo.todos();

    const [checked, setChecked] = useState({
        checkbox1: false,
        checkbox2: false,
    });

    const handleCheckboxChange = async (e) => {
        const { name, checked: isChecked } = e.target;
      
        // Cập nhật trạng thái
        if (name === "checkbox1") {
          setChecked({
            checkbox1: isChecked,
            checkbox2: false, // Reset trạng thái của checkbox 2
          });
      
          if (isChecked) {
            const result = await getTodoByStatus(1);
            setTodos(result);
            console.log("Kết quả API cho trạng thái 1:", result);
          } else {
            const result = await getAllTodos();
            setTodos(result);
          }
        } else if (name === "checkbox2") {
          setChecked({
            checkbox1: false, // Reset trạng thái của checkbox 1
            checkbox2: isChecked,
          });
      
          if (isChecked) {
            const result = await getTodoByStatus(0);
            setTodos(result);
            console.log("Kết quả API cho trạng thái 0:", result);
          } else {
            const result = await getAllTodos();
            setTodos(result);
          }
        }
    };

    return (
        <div className="container mx-auto pl-5 mb-4">
            <Space direction="horizontal" size="large">
            <Checkbox
                name="checkbox1"
                checked={checked.checkbox1}
                onChange={handleCheckboxChange}
            >
                Đã hoàn thành
            </Checkbox>
            <Checkbox
                name="checkbox2"
                checked={checked.checkbox2}
                onChange={handleCheckboxChange}
            >
                Chưa hoàn thành
            </Checkbox>
            </Space>
        </div>
    );
};

export default TodoStatusFilter;
