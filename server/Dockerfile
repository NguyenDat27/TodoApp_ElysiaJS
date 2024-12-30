# Sử dụng hình ảnh chính thức của BunJS
FROM oven/bun:latest

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json, bun.lockb và .env
COPY package.json bun.lockb ./

# Cài đặt các package
RUN bun install

# Copy toàn bộ source code vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Command để chạy server
CMD ["bun", "dev"]