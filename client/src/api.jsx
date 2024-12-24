const urlServer = "http://localhost:3000/api/v1/todos"

// Lấy tất cả todo
export const apiGetAllTodos = `${urlServer}/todos`

// Lấy 1 todo 
export const apiGetTodo = (id) => `${urlServer}/todo/${id}`

// Tạo 1 todo
export const apiCreateTodo = `${urlServer}/create/todo`

// Cập nhật 1 todo
export const apiUpdateTodo = (id) => `${urlServer}/update/${id}`

// Xóa 1 todo
export const apiDeleteTodo = (id) => `${urlServer}/delete/${id}`

// Tìm kiếm todo theo title
export const apiSearchTodo = (title) => `${urlServer}/search/${title}`

// Lấy phần trăm hoàn thành
export const apiPercentTodo = `${urlServer}/percent`

// Lọc theo đã hoàn thành/ chưa hoàng thành
export const apiStatusTodo = (completed) => `${urlServer}/completed/${completed}`

