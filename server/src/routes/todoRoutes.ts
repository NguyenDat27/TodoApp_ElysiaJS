import { Elysia, t, Cookie, Context } from "elysia";
import Todo from "../models/todo";
import { authMiddleware } from "../middlewares/middlewares";
import mongoose from "mongoose";

interface JwtPayload {
  id: string;
  username: string;
}

interface JwtContext extends Context {
  jwtAccessToken: {
    sign: (payload: object, options?: object) => Promise<string>;
    verify: (token: string) => Promise<JwtPayload | null>;
  };
  jwtRefreshToken: {
    sign: (payload: object, options?: object) => Promise<string>;
    verify: (token: string) => Promise<JwtPayload | null>;
  };
  cookie: Record<string, Cookie<string | undefined>>;
  header: Record<string, string | undefined>;
}


// Tạo một đối tượng Elysia để quản lý các route
const TodoRoutes = new Elysia();

TodoRoutes.group("/api/v1/todos", (TodoRoutes) =>
  TodoRoutes
    // Lấy tất cả todo và thực hiện phân trang
    .get("/", 
      async ({ query, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { query: { page?: string, limit?: string }, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"]}) => {
      let result;
      const page = parseInt(query.page ?? '1');
      const limit = parseInt(query.limit ?? '10');
      const skip = (page - 1) * limit;

      try {
        const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id );
        console.log("Auth result:", authResult);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            const userId = id.value ? id.value.replace(/"/g, '') : '';
            console.log("Id:", );
            const todos = await Todo.find({ userId: userId })
              .select("id title description completed")
              .skip(skip)
              .limit(limit);
            const totalTodo = await Todo.countDocuments({ userId: userId });
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
          }
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
      async ({ params: { todo_id }, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { params: { todo_id: string }, set: { status: number, headers: JwtContext["header"] }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["headers"], cookie: JwtContext["cookie"] }) => {
        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            const userId = id.value ? id.value.replace(/"/g, '') : '';
            const todo = await Todo.findOne({ _id: todo_id, userId }).select("id title description completed").lean();
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
              todo: todo,
              message: "Lấy dữ liệu thành công"
            };
          }
        } catch (err) {
          console.log(err);
          set.status = 500;
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
      async ({ body, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { body: { title: string, description: string }, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"] }) => {
        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            const userId = id.value ? id.value.replace(/"/g, '') : '';
            const newTodo = new Todo({
              title: body.title,
              description: body.description,
              userId: userId,
              completed: false
            });
            await newTodo.save();
            set.status = 201;
            return { 
              status: 201,
              todo: newTodo,
              message: "Tạo todo thành công" 
            };
          }
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
          completed: t.Number({ description: "Tạo trạng thái cho todo (0 là chưa làm, 1 là đã làm)", default: 0})
        })
      }
    )

    // Cập nhật todo theo id
    .put("/:todo_id", 
      async ({ params: { todo_id }, body, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { params: { todo_id: string }, body: { title?: string, description?: string, completed?: boolean }, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"] }) => {
        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            const userId = id.value ? id.value.replace(/"/g, '') : '';
            const updatedTodo = await Todo.findOneAndUpdate(
              { _id: todo_id, userId },
              { $set: body },
              { new: true }
            ).select("id title description completed").lean();
            if (!updatedTodo) {
              set.status = 404;
              return {
                status: 404,
                message: "Không tìm thấy Todo"
              };
            }
            set.status = 200;
            return {
              status: 200,
              todo: updatedTodo,
              message: "Cập nhật Todo thành công"
            };
          }
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
      async ({ params: { todo_id }, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { params: { todo_id: string }, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"] }) => {
        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            
            const userId = id.value ? id.value.replace(/"/g, '') : '';
            const deletedTodo = await Todo.findOneAndDelete({ _id: todo_id, userId }).select("id title description completed").lean();
            if (!deletedTodo) {
              set.status = 404;
              return {
                status: 404,
                message: "Không tìm thấy Todo"
              };
            }
            set.status = 200;
            return {
              status: 200,
              todo: deletedTodo,
              message: "Xóa Todo thành công"
            };
          }
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
      async ({ params: { title }, query, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { params: { title: string }, query: { page?: string, limit?: string }, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"] }) => {
        let result;
        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const skip = (page - 1) * limit;

        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {

            const userId = id.value ? id.value.replace(/"/g, '') : '';
            // Giải mã chuỗi URL
            const decodedTitle = decodeURIComponent(title);
            console.log("Decoded title:", decodedTitle);
        
            // Tìm kiếm các todo có title chứa từ khóa tìm kiếm
            const todos = await Todo.find({ userId, title: new RegExp(decodedTitle, 'i') })
              .select("id title description completed")
              .skip(skip)
              .limit(limit);
            const totalTodo = await Todo.countDocuments({ userId, title: new RegExp(decodedTitle, 'i') });
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
              message: "Lấy dữ liệu thành công"
            };
          }
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
      async ({ set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"] }) => {
        let result;
        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            
            const userId = id.value ? new mongoose.Types.ObjectId(id.value.replace(/"/g, '')) : null;
            console.log('userId:', userId); // Kiểm tra giá trị userId

            const aggregationResult = await Todo.aggregate([
              { $match: { userId } },
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

            console.log('aggregationResult:', aggregationResult); // Kiểm tra kết quả của truy vấn

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
              data: aggregationResult[0],
              message: "Tính toán thành công"
            };
          }
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
      async ({ params: { completed }, query, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { params: { completed: number }, query: { page?: string, limit?: string }, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["header"], cookie: JwtContext["cookie"] }) => {
        let result;
        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const skip = (page - 1) * limit;

        try {
          const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
          if (authResult.status !== 200) {
            set.status = authResult.status;
            return authResult;
          } else {
            const userId = id.value ? id.value.replace(/"/g, '') : '';
            const todos = await Todo.find({ userId, completed })
              .select("id title description completed")
              .skip(skip)
              .limit(limit);
            const totalTodo = await Todo.countDocuments({ userId, completed });
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
              message: "Lấy dữ liệu thành công"
            };
          }
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
