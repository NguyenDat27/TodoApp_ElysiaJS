import { Elysia, t } from "elysia";
import Todo from "../models/todo";

const TodoRoutes = new Elysia();

TodoRoutes.group("/api/v1/todos", (TodoRoutes) =>
  TodoRoutes
    .get("/todos", 
      async ({ set }: { set: { status: number } }) => {
        try {
          const todos = await Todo.find({});
          set.status = 200;
          return todos;
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Lấy dữ liệu của tất cả todo",
          tags: ["Get"]
        }, 
      }
    )
    .get("/todo/:todo_id", 
      async ({ params: { todo_id }, set }: { params: { todo_id: string }, set: { status: number, headers: { [key: string]: string } } }) => {
        try {
          const todo = await Todo.findById(todo_id).lean();
          if (!todo) {
            set.status = 404;
            set.headers = { 'Content-Type': 'application/json' };
            return { message: "Không tìm thấy Todo" };
          }
          set.status = 200;
          set.headers = { 'Content-Type': 'application/json' };
          return todo;
        } catch (err) {
          set.status = 500;
          set.headers = { 'Content-Type': 'application/json' };
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Lấy dữ liệu theo id",
          tags: ["Get"]
        },
        params: t.Object({
          todo_id: t.String({ description: "Id của todo cần lấy dữ liệu"})
        })
      }
    )
    .post("/create/todo", 
      async ({ body, set }: { body: { title: string, description: string, completed: number }, set: { status: number } }) => {
        try {
          const newTodo = new Todo(body);
          await newTodo.save();
          set.status = 201;
          return { message: "Tạo todo thành công" };
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Tạo 1 todo",
          tags: ["Create"]
        },
        body: t.Object({
          title: t.String({ description: "Tạo tiêu đề cho todo mới"}),
          description: t.String({ description: "Tạo mô tả cho todo mới"}),
          todo_id: t.Number({ description: "Tạo trạng thái cho todo (0 là chưa làm, 1 là đã làm)", default: 0})
        })
      }
    )
    .put("/update/:todo_id", 
      async ({ body, set, params: { todo_id } }: { body: { title: string, description: string, completed: number }, set: { status: number }, params: { todo_id: string } }) => {
        try {
          const foundTodo = await Todo.findById(todo_id);
          if (!foundTodo) {
            set.status = 404;
            return { message: "Không tìm thấy todo" };
          }
      
          await Todo.findByIdAndUpdate(todo_id, body);
          set.status = 200;
          return { message: "Cập nhật todo thành công" };
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Cập nhật 1 todo theo id",
          tags: ["Update"]
        },
        params: t.Object({
          todo_id: t.String({ description: "Id của todo cần cập nhật"})
        }),
        body: t.Object({
          title: t.String({ description: "Cập nhật tiêu đề cho todo"}),
          description: t.String({ description: "Cập nhật mô tả cho todo"}),
          todo_id: t.Number({ description: "Cập nhật trạng thái cho todo (0 là chưa làm, 1 là đã làm)"})
        })
      }
    )
    .delete("/delete/:todo_id",
      async ({ params: { todo_id }, set }: { params: { todo_id: string }, set: { status: number } }) => {
        try {
          const foundTodo = await Todo.findById(todo_id);
          if (!foundTodo) {
            set.status = 404;
            return { message: "Không tìm thấy todo" };
          }
      
          await Todo.findByIdAndDelete(todo_id);
          set.status = 200;
          return { message: "Xóa todo thành công" };
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Xóa todo theo id",
          tags: ["Delete"]
        },
        params: t.Object({
          todo_id: t.String({ description: "Id của todo cần xóa dữ liệu"})
        })
      }
    )
    .get("/search/:title", 
      async ({ params: { title }, set }: { params: { title: string }, set: { status: number } }) => {
        try {
          // Giải mã chuỗi URL
          const decodedTitle = decodeURIComponent(title);
          console.log("Decoded title:", decodedTitle);
      
          // Tìm kiếm các todo có title chứa từ khóa
          const foundTodos = await Todo.find({ title: new RegExp(decodedTitle, 'i') });
          if (!foundTodos || foundTodos.length === 0) {
            set.status = 404;
            return { message: "Không tìm thấy todo" };
          }
      
          set.status = 200;
          return foundTodos;
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Tìm kiếm todo theo title",
          tags: ["Search"]
        },
        params: t.Object({
          title: t.String({ description: "Tiêu đề cần tìm kiếm"})
        })
      }
    )
    .get("/percent", 
      async ({ set }: { set: { status: number } }) => {
        try {
          const totalTodos = await Todo.countDocuments();
          console.log("total:", totalTodos);
          const completedTodos = await Todo.countDocuments({ completed: 1 });
          console.log("complete:", completedTodos);
      
          if (totalTodos === 0) {
            set.status = 200;
            return { completionPercentage: 0 };
          }
      
          const completionPercentage = (completedTodos / totalTodos) * 100;
          set.status = 200;
          return { completionPercentage };
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Tính % todo đã hoàn thành ",
          tags: ["Calculation"]
        }
      }
    )
    .get("/completed/:completed", 
      async ({ params, set }: { params: { completed: number }, set: { status: number } }) => {
        try {
          const isCompleted = params.completed;
          console.log("Lọc theo trạng thái:", isCompleted);
      
          const todos = await Todo.find({ completed: isCompleted });
          console.log("Tìm thấy todo:", todos.length);
      
          if (todos.length === 0) {
            set.status = 404;
            return { message: "Không tìm thấy todo" };
          }
      
          set.status = 200;
          return todos;
        } catch (err) {
          set.status = 500;
          return { message: "Lỗi mạng nội bộ" };
        }
      }, {
        detail: {
          summary: "Tìm kiếm todo theo trạng thái",
          tags: ["Search"]
        },
        params: t.Object({
          completed: t.Number({ description: "Trạng thái cần lọc lấy todo (0 là chưa làm, 1 là đã làm)"})
        })
      }
    )
);

export default TodoRoutes;
