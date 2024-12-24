# Sử dụng image Bun chính thức
FROM oven/bun:latest

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và bun.lockb nếu có
COPY bun.lockb package.json ./

# Cài đặt dependencies
RUN bun install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Command để chạy ứng dụng
CMD ["bun", "dev"]
