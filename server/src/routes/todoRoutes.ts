import { Elysia, t } from "elysia";
import Todo from "../models/todo";



// Tạo một đối tượng Elysia để quản lý các route
const TodoRoutes = new Elysia();

TodoRoutes.group("/api/v1/todos", (TodoRoutes) =>
  TodoRoutes
    // Lấy tất cả todo và thực hiện phân trang
    .get("/", 
      async ({ query, set }: { query: { page?: string, limit?: string }, set: { status: number } }) => {
        let result;
        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const skip = (page - 1) * limit;

        try {
          const todos = await Todo.find({})
            .select("id title description completed")
            .skip(skip)
            .limit(limit);
          const totalTodo = await Todo.countDocuments({});
          const totalPages = Math.ceil(totalTodo / limit);
          set.status = 200;
          result = {
            status: 200,
            todos: todos,
            totalTodo: totalTodo,
            page: page,
            limit: limit,
            totalPages: totalPages,
            message: "Lấy dữ liệu thành công"
          };
        } catch (err) {
          set.status = 500;
          result = { 
            status: 500,
            message: "Lỗi mạng nội bộ",
          };
        }
        return result;
      }, {
        detail: {
          summary: "Lấy dữ liệu của tất cả todo với phân trang",
          tags: ["Get"]
        }
      })

    // Lấy dữ liệu theo id
    .get("/:todo_id", 
      async ({ params: { todo_id }, set }: { params: { todo_id: string }, set: { status: number, headers: { [key: string]: string } } }) => {
        try {
          const todo = await Todo.findById(todo_id).select("id title description completed").lean();
          if (!todo) {
            set.status = 404;
            set.headers = { 'Content-Type': 'application/json' };
            return { 
              status: 404,
              message: "Không tìm thấy Todo" 
            };
          }
          set.status = 200;
          set.headers = { 'Content-Type': 'application/json' };
          return {
            status: 200,
            todos: todo,
            message: "Lấy dữ liệu thành công"
          };
        } catch (err) {
          set.status = 500;
          set.headers = { 'Content-Type': 'application/json' };
          return { 
            status: 500,
            message: "Lỗi mạng nội bộ" 
          };
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

    // Tạo một todo mới
    .post("/", 
      async ({ body, set }: { body: { title: string, description: string, completed: number }, set: { status: number } }) => {
        try {
          const newTodo = new Todo(body);
          await newTodo.save();
          set.status = 201;
          return { 
            status: 201,
            message: "Tạo todo thành công" 
          };
        } catch (err) {
          set.status = 500;
          return { 
            status: 500,
            message: "Lỗi mạng nội bộ" };
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

    // Cập nhật todo theo id
    .put("/:todo_id", 
      async ({ body, set, params: { todo_id } }: { body: { title: string, description: string, completed: number }, set: { status: number }, params: { todo_id: string } }) => {
        try {
          const foundTodo = await Todo.findById(todo_id);
          if (!foundTodo) {
            set.status = 404;
            return {
              status: 404,
              message: "Không tìm thấy todo" 
            };
          }
      
          await Todo.findByIdAndUpdate(todo_id, body);
          set.status = 200;
          return { 
            status: 200,
            message: "Cập nhật todo thành công" 
          };
        } catch (err) {
          set.status = 500;
          return { 
            status: 500,
            message: "Lỗi mạng nội bộ"
          };
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
          completed: t.Number({ description: "Cập nhật trạng thái cho todo (0 là chưa làm, 1 là đã làm)"})
        })
      }
    )

    //  Xóa todo theo id
    .delete("/:todo_id",
      async ({ params: { todo_id }, set }: { params: { todo_id: string }, set: { status: number } }) => {
        try {
          const foundTodo = await Todo.findById(todo_id);
          if (!foundTodo) {
            set.status = 404;
            return { message: "Không tìm thấy todo" };
          }
      
          await Todo.findByIdAndDelete(todo_id);
          set.status = 200;
          return { 
            status: 200,
            message: "Xóa todo thành công"
          };
        } catch (err) {
          set.status = 500;
          return {
              status: 500,
              message: "Lỗi mạng nội bộ" 
            };
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

    // Tìm kiếm todo theo tiêu đề
    .get("/search/:title", 
      async ({ params: { title }, query, set }: { params: { title: string }, query: { page?: string, limit?: string }, set: { status: number } }) => {
        let result;
        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const skip = (page - 1) * limit;

        try {
          // Giải mã chuỗi URL
          const decodedTitle = decodeURIComponent(title);
          console.log("Decoded title:", decodedTitle);
      
          // Tìm kiếm các todo có title chứa từ khóa
          const foundTodos = await Todo.find({ title: new RegExp(decodedTitle, 'i') })
            .select("id title description completed")
            .skip(skip)
            .limit(limit);
          const totalTodo = await Todo.countDocuments({ title: new RegExp(decodedTitle, 'i') });
          const totalPages = Math.ceil(totalTodo / limit);
          if (!foundTodos || foundTodos.length === 0) {
            set.status = 404;
            return { 
              status: 404,
              message: "Không tìm thấy todo"
            };
          }
      
          set.status = 200;
          result = {
            status: 200,
            todos: foundTodos,
            totalTodo: totalTodo,
            page: page,
            limit: limit,
            totalPages: totalPages,
            message: "Tìm thấy todo"
          };
        } catch (err) {
          set.status = 500;
          result = { 
            status: 500,
            message: "Lỗi mạng nội bộ",
          };
        }
        return result;
      }, {
        detail: {
          summary: "Tìm kiếm todo theo tiêu đề với phân trang",
          tags: ["Search"]
        }
      }
    )

    // Tính % todo đã hoàn thành
    .get("/percent", 
      async ({ set }: { set: { status: number } }) => {
        let result;
        try {
          const aggregationResult = await Todo.aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: { $sum: { $cond: ["$completed", 1, 0] } }
              }
            },
            {
              $project: {
                _id: 0,
                total: 1,
                completed: 1,
                percentCompleted: { $multiply: [{ $divide: ["$completed", "$total"] }, 100] }
              }
            }
          ]);

          if (aggregationResult.length === 0) {
            set.status = 404;
            return { 
              status: 404,
              message: "Không có dữ liệu"
            };
          }

          set.status = 200;
          result = {
            status: 200,
            total: aggregationResult[0].total,
            completed: aggregationResult[0].completed,
            percentCompleted: aggregationResult[0].percentCompleted,
            message: "Tính toán thành công"
          };
        } catch (err) {
          set.status = 500;
          result = { 
            status: 500,
            message: "Lỗi mạng nội bộ",
          };
        }
        return result;
      }, {
        detail: {
          summary: "Tính % todo đã hoàn thành",
          tags: ["Calculation"]
        }
      }
    )

    // Lọc todo theo trạng thái
    .get("/filter/:completed", 
      async ({ params: { completed }, query, set }: { params: { completed: number }, query: { page?: string, limit?: string }, set: { status: number } }) => {
        let result;
        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const skip = (page - 1) * limit;

        try {
          const todos = await Todo.find({ completed: completed })
            .select("id title description completed")
            .skip(skip)
            .limit(limit);
          const totalTodo = await Todo.countDocuments({ completed: completed });
          const totalPages = Math.ceil(totalTodo / limit);
          
          if (todos.length === 0) {
            set.status = 404;
            return { 
              status: 404,
              message: "Không tìm thấy todo"
            };
          }
      
          set.status = 200;
          result = {
            status: 200,
            todos: todos,
            totalTodo: totalTodo,
            page: page,
            limit: limit,
            totalPages: totalPages,
            message: "Tìm thấy todo"
          };
        } catch (err) {
          set.status = 500;
          result = { 
            status: 500,
            message: "Lỗi mạng nội bộ",
          };
        }
        return result;
      }, {
        detail: {
          summary: "Tìm kiếm todo theo trạng thái với phân trang",
          tags: ["Search"]
        }
      }
    )
);

export default TodoRoutes;
